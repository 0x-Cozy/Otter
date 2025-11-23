import { useState } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { SealClient, SessionKey, NoAccessError } from '@mysten/seal';
import { Transaction } from '@mysten/sui/transactions';
import { fromHex } from '@mysten/sui/utils';
import { ChunkedBlobHeader, extractEncryptedChunks, dechunk, parseChunkedBlobHeader } from 'otter-protocol';

interface DecryptionResult {
  data: Uint8Array;
  fileExtension?: string;
}

export function useBlobDecryption() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [decrypting, setDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decryptBlob = async (
    blob: ArrayBuffer,
    header: ChunkedBlobHeader,
    sessionKey: SessionKey,
    chunkIndices: number[],
    _policyObjectId: string,
  ): Promise<DecryptionResult | null> => {
    setDecrypting(true);
    setError(null);

    try {
      const sealClient = new SealClient({
        suiClient: suiClient as any,
        serverConfigs: header.serverConfigs,
        verifyKeyServers: false,
      });

      const isUnchunked = header.numChunks === 0;

      if (isUnchunked) {
        const { headerSize } = parseChunkedBlobHeader(blob);
        const blobData = new Uint8Array(blob);
        const encryptedBlob = blobData.slice(headerSize);
        
        if (header.chunks.length === 0) {
          throw new Error('Unchunked blob header missing chunk metadata');
        }
        const chunkId = header.chunks[0].id;

        // subscription needs clock object
        const isSubscription = header.module === 'subscription';
        const tx = new Transaction();
        tx.setSender(currentAccount!.address);
        
        if (isSubscription) {
          tx.moveCall({
            target: `${header.packageId}::${header.module}::seal_approve`,
            arguments: [
              tx.pure.vector('u8', fromHex(chunkId)),
              tx.object(header.policyObjectId),
              tx.object('0x6'),
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
        const txBytes = await tx.build({ client: suiClient as any, onlyTransactionKind: true });

        try {
          await sealClient.fetchKeys({
            ids: [chunkId],
            txBytes,
            sessionKey,
            threshold: header.threshold,
          });
        } catch (err) {
          // re-throw so caller handles payment
          if (err instanceof NoAccessError) {
            throw err;
          }
          throw err;
        }

        const decrypted = await sealClient.decrypt({
          data: encryptedBlob,
          sessionKey,
          txBytes,
        });

        setDecrypting(false);
        return {
          data: decrypted,
          fileExtension: header.fileExtension,
        };
      } else {
      const encryptedChunks = extractEncryptedChunks(blob, header, chunkIndices);

      // subscription needs clock object
      const isSubscription = header.module === 'subscription';
      const chunkIds = encryptedChunks.map((c) => c.id);
      const tx = new Transaction();
      tx.setSender(currentAccount!.address);
      chunkIds.forEach((id: string) => {
        if (isSubscription) {
          tx.moveCall({
            target: `${header.packageId}::${header.module}::seal_approve`,
            arguments: [
              tx.pure.vector('u8', fromHex(id)),
              tx.object(header.policyObjectId),
              tx.object('0x6'),
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
      const txBytes = await tx.build({ client: suiClient as any, onlyTransactionKind: true });

      await sealClient.fetchKeys({
        ids: chunkIds,
        txBytes,
        sessionKey,
        threshold: header.threshold,
      });

      const decryptedChunks: Uint8Array[] = [];
      for (const encryptedChunk of encryptedChunks) {
        const chunkTx = new Transaction();
        if (isSubscription) {
          chunkTx.moveCall({
            target: `${header.packageId}::${header.module}::seal_approve`,
            arguments: [
              chunkTx.pure.vector('u8', fromHex(encryptedChunk.id)),
              chunkTx.object(header.policyObjectId),
              chunkTx.object('0x6'),
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
        const chunkTxBytes = await chunkTx.build({ client: suiClient as any, onlyTransactionKind: true });

        const decrypted = await sealClient.decrypt({
          data: encryptedChunk.data,
          sessionKey,
          txBytes: chunkTxBytes,
        });
        decryptedChunks.push(decrypted);
      }

      const combinedData = dechunk({
        decryptedChunks,
        chunkIndices,
        chunkMetadata: header.chunks,
      });

      setDecrypting(false);
      return {
        data: combinedData,
        fileExtension: header.fileExtension,
      };
      }
    } catch (err) {
      if (err instanceof NoAccessError) {
        setDecrypting(false);
        throw err;
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrypt blob';
      setError(errorMessage);
      setDecrypting(false);
      return null;
    }
  };

  return { decryptBlob, decrypting, error };
}

