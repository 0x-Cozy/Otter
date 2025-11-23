import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import type { ChunkedBlobHeader } from 'otter-protocol/dist/types.js';

const CLOCK_OBJECT_ID = '0x6';

export interface PaymentQuote {
  chunksNeeded: number;
  currentMaxIndex: number;
  totalFeeNeeded: bigint;
}

export async function getPaymentQuote(
  suiClient: SuiClient,
  keypair: Ed25519Keypair,
  header: ChunkedBlobHeader,
  targetMaxIndex: number,
): Promise<PaymentQuote | null> {
  if (!header.gatewayFunction) {
    return null;
  }

  const gatewayFunction = header.gatewayFunction;
  
  if (!gatewayFunction.function) {
    throw new Error('gatewayFunction.function is required but not provided in blob header');
  }
  
  const previewFunctionName = gatewayFunction.previewFunction || `${gatewayFunction.function}_preview`;
  const previewTarget = `${gatewayFunction.packageId}::${gatewayFunction.module}::${previewFunctionName}`;

  try {
    const previewTx = new Transaction();
    previewTx.setSender(keypair.toSuiAddress());

    const previewArgs = [
      previewTx.object(header.policyObjectId),
      previewTx.pure.u64(targetMaxIndex),
    ];
    
    previewTx.moveCall({
      target: previewTarget,
      arguments: previewArgs,
    });
    previewTx.setGasBudget(10000000);

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: previewTx,
      options: {
        showEvents: true,
      },
    });

    await suiClient.waitForTransaction({
      digest: result.digest,
      options: { showEvents: true },
    });

    const txDetails = await suiClient.getTransactionBlock({
      digest: result.digest,
      options: { showEvents: true },
    });

    const quoteEventTypeName = gatewayFunction.quoteEventType || 'QuoteEvent';
    const quoteEventType = `${gatewayFunction.packageId}::${gatewayFunction.module}::${quoteEventTypeName}`;

    const quoteEvent = txDetails.events?.find((event: any) => event.type === quoteEventType);

    if (quoteEvent) {
      const quoteData = (quoteEvent.parsedJson || {}) as Record<string, any>;
      const chunksNeeded = Number(quoteData.chunks_needed ?? quoteData.chunksNeeded ?? 0);
      const currentMaxIndex = Number(quoteData.current_max_index ?? quoteData.currentMaxIndex ?? 0);
      const totalFeeNeeded = BigInt(quoteData.total_fee ?? quoteData.totalFee ?? 0);

      return {
        chunksNeeded,
        currentMaxIndex,
        totalFeeNeeded,
      };
    }

    return null;
  } catch (err) {
    console.error('Could not execute preview transaction:', err);
    return null;
  }
}

//process payment for chunked pricing modules
export async function processPayment(
  suiClient: SuiClient,
  keypair: Ed25519Keypair,
  header: ChunkedBlobHeader,
  targetMaxIndex: number,
  totalFeeNeeded: bigint,
): Promise<boolean> {
  if (!header.gatewayFunction) {
    return false;
  }

  try {
    const tx = new Transaction();
    tx.setSender(keypair.toSuiAddress());
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalFeeNeeded.toString())]);

    const gatewayFunction = header.gatewayFunction;
    
    if (!gatewayFunction.function) {
      throw new Error('gatewayFunction.function is required but not provided in blob header');
    }
    
    const paymentArgs = [
      coin,
      tx.object(header.policyObjectId),
      tx.pure.u64(targetMaxIndex),
    ];
    
    tx.moveCall({
      target: `${gatewayFunction.packageId}::${gatewayFunction.module}::${gatewayFunction.function}`,
      arguments: paymentArgs,
    });
    tx.setGasBudget(20000000);

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true,
      },
    });

    await suiClient.waitForTransaction({
      digest: result.digest,
      options: { showEffects: true },
    });

    return true;
  } catch (err) {
    console.error('Payment transaction failed:', err);
    throw err;
  }
}


export async function handleUnchunkedPayment(
  suiClient: SuiClient,
  keypair: Ed25519Keypair,
  header: ChunkedBlobHeader,
): Promise<void> {
  if (!header.gatewayFunction) {
    throw new Error(
      `Cannot handle payment generically for module "${header.module}" - no gateway function provided in header. ` +
      `The contract should provide a gatewayFunction in the blob header to enable generic payment handling.`
    );
  }

  const gatewayFunction = header.gatewayFunction;
  
  if (!gatewayFunction.function) {
    throw new Error('gatewayFunction.function is required but not provided in blob header');
  }
  
  const previewFunctionName = gatewayFunction.previewFunction || `${gatewayFunction.function}_preview`;
  const quoteEventTypeName = gatewayFunction.quoteEventType || 'QuoteEvent';
  
  let totalFeeNeeded: bigint;
  
  try {
    const previewTarget = `${gatewayFunction.packageId}::${gatewayFunction.module}::${previewFunctionName}`;
    const previewTx = new Transaction();
    previewTx.setSender(keypair.toSuiAddress());

    const previewArgs = gatewayFunction.arguments 
      ? gatewayFunction.arguments.map((arg: any) => {
          if (typeof arg === 'string' && arg.startsWith('0x')) {
            return previewTx.object(arg);
          }
          return previewTx.pure.u64(arg);
        })
      : [
          previewTx.object(header.policyObjectId),
        ];

    previewTx.moveCall({
      target: previewTarget,
      arguments: previewArgs,
    });
    previewTx.setGasBudget(10000000);

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: previewTx,
      options: {
        showEvents: true,
      },
    });

    await suiClient.waitForTransaction({
      digest: result.digest,
      options: { showEvents: true },
    });

    const txDetails = await suiClient.getTransactionBlock({
      digest: result.digest,
      options: { showEvents: true },
    });

    const quoteEventType = `${gatewayFunction.packageId}::${gatewayFunction.module}::${quoteEventTypeName}`;
    const quoteEvent = txDetails.events?.find((event: any) => event.type === quoteEventType);

    if (quoteEvent) {
      const quoteData = (quoteEvent.parsedJson || {}) as Record<string, any>;
      totalFeeNeeded = BigInt(quoteData.total_fee ?? quoteData.totalFee ?? quoteData.fee ?? 100000000);
    } else {
      totalFeeNeeded = BigInt(100000000);
    }
  } catch (err) {
    console.warn('Preview transaction failed, using default fee:', err);
    totalFeeNeeded = BigInt(100000000);
  }

  const tx = new Transaction();
  tx.setSender(keypair.toSuiAddress());
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalFeeNeeded.toString())]);

  const paymentArgs = gatewayFunction.arguments
    ? [coin, ...gatewayFunction.arguments.map((arg: any) => {
        if (typeof arg === 'string' && arg.startsWith('0x')) {
          return tx.object(arg);
        }
        return tx.pure.u64(arg);
      })]
    : [
        coin,
        tx.object(header.policyObjectId),
      ];

  tx.moveCall({
    target: `${gatewayFunction.packageId}::${gatewayFunction.module}::${gatewayFunction.function}`,
    arguments: paymentArgs,
  });
  tx.setGasBudget(20000000);

  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
    options: { showEffects: true },
  });

  console.log('Payment successful:', result.digest);
}

