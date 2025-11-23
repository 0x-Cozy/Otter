import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { ChunkedBlobHeader } from 'otter-protocol';

interface PaymentQuote {
  chunksNeeded: number;
  currentMaxIndex: number;
  totalFeeNeeded: bigint;
}

export function useGatewayPayment() {
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const getPaymentQuote = async (
    header: ChunkedBlobHeader,
    targetMaxIndex: number,
  ): Promise<PaymentQuote | null> => {
    if (!header.gatewayFunction) {
      return null;
    }

    const gatewayFunction = header.gatewayFunction;
    
    if (!gatewayFunction.function) {
      throw new Error('gatewayFunction.function is required but not provided in blob header');
    }
    
    const previewFunctionName = gatewayFunction.previewFunction || `${gatewayFunction.function}_preview`;
    const quoteEventTypeName = gatewayFunction.quoteEventType || 'QuoteEvent';
    
    const previewTarget = `${gatewayFunction.packageId}::${gatewayFunction.module}::${previewFunctionName}`;
    const quoteEventType = `${gatewayFunction.packageId}::${gatewayFunction.module}::${quoteEventTypeName}`;

    return new Promise((resolve) => {
      try {
        const previewTx = new Transaction();
        
        const previewArgs = [
          previewTx.object(header.policyObjectId),
          previewTx.pure.u64(targetMaxIndex),
        ];
        
        previewTx.moveCall({
          target: previewTarget,
          arguments: previewArgs,
        });
        previewTx.setGasBudget(10000000);

        signAndExecute(
          {
            transaction: previewTx as any,
          },
          {
            onSuccess: async (result) => {
              try {
                await suiClient.waitForTransaction({
                  digest: result.digest,
                  options: { showEvents: true },
                });

                const txDetails = await suiClient.getTransactionBlock({
                  digest: result.digest,
                  options: { showEvents: true },
                });

                const quoteEvent = txDetails.events?.find((event: any) => event.type === quoteEventType);

                if (quoteEvent) {
                  const quoteData = (quoteEvent.parsedJson || {}) as Record<string, any>;
                  const chunksNeeded = Number(quoteData.chunks_needed ?? quoteData.chunksNeeded ?? 0);
                  const currentMaxIndex = Number(quoteData.current_max_index ?? quoteData.currentMaxIndex ?? 0);
                  const totalFeeNeeded = BigInt(quoteData.total_fee ?? quoteData.totalFee ?? 0);

                  resolve({
                    chunksNeeded,
                    currentMaxIndex,
                    totalFeeNeeded,
                  });
                } else {
                  resolve(null);
                }
              } catch (err) {
                console.error('Error processing preview transaction result:', err);
                resolve(null);
              }
            },
            onError: (error) => {
              console.error('Preview transaction failed:', error);
              resolve(null);
            },
          },
        );
      } catch (err) {
        console.error('Could not execute preview transaction:', err);
        resolve(null);
      }
    });
  };

  const processPayment = async (
    header: ChunkedBlobHeader,
    targetMaxIndex: number,
    totalFeeNeeded: bigint,
  ): Promise<boolean> => {
    if (!header.gatewayFunction) {
      throw new Error('gatewayFunction is required but not provided in blob header');
    }

    const gatewayFunction = header.gatewayFunction;
    
    if (!gatewayFunction.function) {
      throw new Error('gatewayFunction.function is required but not provided in blob header');
    }

    return new Promise((resolve, reject) => {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalFeeNeeded.toString())]);
      
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

      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: async (result) => {
            try {
              await suiClient.waitForTransaction({
                digest: result.digest,
                options: { showEffects: true },
              });
              resolve(true);
            } catch (waitErr) {
              console.warn('Could not wait for transaction, proceeding anyway:', waitErr);
              await new Promise((r) => setTimeout(r, 2000));
              resolve(true);
            }
          },
          onError: (error) => {
            console.error('Payment transaction failed:', error);
            reject(error);
          },
        },
      );
    });
  };

  return { getPaymentQuote, processPayment };
}

