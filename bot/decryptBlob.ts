import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SealClient, SessionKey, NoAccessError } from '@mysten/seal';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHex } from '@mysten/sui/utils';
import { downloadBlob } from './utils/download.js';
import { parseChunkedBlobHeader, extractEncryptedChunks, dechunk } from 'otter-protocol';
import { createSessionKey } from './utils/sessionKey.js';
import { getPaymentQuote, processPayment, handleUnchunkedPayment } from './utils/payment.js';

const CLOCK_OBJECT_ID = '0x6';

export interface DecryptionResult {
  data: Uint8Array;
  fileExtension?: string;
}

export async function decryptBlob(
  blobId: string,
  keypair: Ed25519Keypair,
  suiClient: SuiClient,
  maxChunks?: number,
): Promise<DecryptionResult> {
  console.log(`Downloading blob: ${blobId}...`);
  
  //1. here were downloading the blob
  const blobData = await downloadBlob(blobId);
  console.log('Blob downloaded successfully');

  //2. Then parse header
  const { header, headerSize } = parseChunkedBlobHeader(blobData);
  console.log('Header parsed:', {
    module: header.module,
    numChunks: header.numChunks,
    fileExtension: header.fileExtension,
    packageId: header.packageId,
  });

  // 3. Create sessionKey
  console.log('Creating session key...');
  console.log('Package ID:', header.packageId);
  console.log('Address:', keypair.toSuiAddress());
  const sessionKey = await createSessionKey(keypair, header.packageId, suiClient);
  console.log('Session key created');

  const sealClient = new SealClient({
    suiClient: suiClient as any,
    serverConfigs: header.serverConfigs,
    verifyKeyServers: false,
  });

  // payments for chunked modules 
  const isUnchunked = header.numChunks === 0;
  const isAllowlist = header.module === 'allowlist';
  const isSubscription = header.module === 'subscription';
  const hasGatewayFunction = !!header.gatewayFunction;

  if (hasGatewayFunction && !isUnchunked) {
    // For chunked modules: use preview first
    const numChunksToDecrypt = maxChunks !== undefined 
      ? Math.min(maxChunks, header.numChunks) 
      : header.numChunks;
    
    const targetMaxIndex = numChunksToDecrypt; // maxChunks is 1-indexed (chunk 1, 2, 3 etc not from 0)
    
    console.log(`Requesting payment for ${numChunksToDecrypt} chunks (out of ${header.numChunks} total)...`);
    const quote = await getPaymentQuote(suiClient, keypair, header, targetMaxIndex);
    
    if (quote && quote.chunksNeeded > 0) {
      console.log(`Payment needed: ${quote.chunksNeeded} chunks, ${quote.totalFeeNeeded} MIST`);
      console.log('Processing payment...');
      await processPayment(suiClient, keypair, header, targetMaxIndex, quote.totalFeeNeeded);
      console.log('Payment successful');
    } else {
      console.log('No payment needed');
    }
  }

  // Decrypt blob
  let decryptedData: Uint8Array;

  if (isUnchunked) {
    // Unchunked decryption
    console.log('Decrypting unchunked blob...');
    
    const encryptedBlob = new Uint8Array(blobData.slice(headerSize));
    const chunkId = header.chunks[0]?.id;
    if (!chunkId) {
      throw new Error('Unchunked blob header missing chunk metadata');
    }

    // build seal_approve tx
    const tx = new Transaction();
    tx.setSender(keypair.toSuiAddress());

    if (isSubscription) {
      tx.moveCall({
        target: `${header.packageId}::${header.module}::seal_approve`,
        arguments: [
          tx.pure.vector('u8', fromHex(chunkId)),
          tx.object(header.policyObjectId),
          tx.object(CLOCK_OBJECT_ID),
        ],
      });
    } else {
      tx.moveCall({
        target: `${header.packageId}::${header.module}::seal_approve`,
        arguments: [
          tx.pure.vector('u8', fromHex(chunkId)),
          tx.object(header.policyObjectId),
        ],
      });
    }

    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });

    // Try to fetch keys- if NoAccessError, handle payment
    try {
      await sealClient.fetchKeys({
        ids: [chunkId],
        txBytes,
        sessionKey,
        threshold: header.threshold,
      });
    } catch (err) {
      if (err instanceof NoAccessError) {
        console.log('No access detected, attempting payment...');
        await handleUnchunkedPayment(suiClient, keypair, header);
        
        // Retry key fetch after payment
        await sealClient.fetchKeys({
          ids: [chunkId],
          txBytes,
          sessionKey,
          threshold: header.threshold,
        });
      } else {
        throw err;
      }
    }

    // Decrypt
    decryptedData = await sealClient.decrypt({
      data: encryptedBlob,
      sessionKey,
      txBytes,
    });
  } else {
    // Chunked decryption - decrypt specified number of chunks
    const numChunksToDecrypt = maxChunks !== undefined 
      ? Math.min(maxChunks, header.numChunks) 
      : header.numChunks;
    
    console.log(`Decrypting chunked blob (${numChunksToDecrypt} of ${header.numChunks} chunks)...`);
    
    const chunkIndices = Array.from({ length: numChunksToDecrypt }, (_, i) => i);
    const encryptedChunks = extractEncryptedChunks(blobData, header, chunkIndices);
    const chunkIds = encryptedChunks.map((c) => c.id);

    //Build batch seal_approve transaction
    const tx = new Transaction();
    tx.setSender(keypair.toSuiAddress());
    
    const isSubscription = header.module === 'subscription';
    chunkIds.forEach((id) => {
      if (isSubscription) {
        tx.moveCall({
          target: `${header.packageId}::${header.module}::seal_approve`,
          arguments: [
            tx.pure.vector('u8', fromHex(id)),
            tx.object(header.policyObjectId),
            tx.object(CLOCK_OBJECT_ID),
          ],
        });
      } else {
        tx.moveCall({
          target: `${header.packageId}::${header.module}::seal_approve`,
          arguments: [
            tx.pure.vector('u8', fromHex(id)),
            tx.object(header.policyObjectId),
          ],
        });
      }
    });

    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });

    await sealClient.fetchKeys({
      ids: chunkIds,
      txBytes,
      sessionKey,
      threshold: header.threshold,
    });

    // Decrypt each chunk
    const decryptedChunks: Uint8Array[] = [];
    for (const encryptedChunk of encryptedChunks) {
      const chunkTx = new Transaction();
      if (isSubscription) {
        chunkTx.moveCall({
          target: `${header.packageId}::${header.module}::seal_approve`,
          arguments: [
            chunkTx.pure.vector('u8', fromHex(encryptedChunk.id)),
            chunkTx.object(header.policyObjectId),
            chunkTx.object(CLOCK_OBJECT_ID),
          ],
        });
      } else {
        chunkTx.moveCall({
          target: `${header.packageId}::${header.module}::seal_approve`,
          arguments: [
            chunkTx.pure.vector('u8', fromHex(encryptedChunk.id)),
            chunkTx.object(header.policyObjectId),
          ],
        });
      }
      const chunkTxBytes = await chunkTx.build({ client: suiClient, onlyTransactionKind: true });

      const decrypted = await sealClient.decrypt({
        data: encryptedChunk.data,
        sessionKey,
        txBytes: chunkTxBytes,
      });
      decryptedChunks.push(decrypted);
    }

    // Dechunk
    decryptedData = dechunk({
      decryptedChunks,
      chunkIndices: chunkIndices,
      chunkMetadata: header.chunks,
    });
  }

  console.log('Decryption successful!');

  return {
    data: decryptedData,
    fileExtension: header.fileExtension,
  };
}

