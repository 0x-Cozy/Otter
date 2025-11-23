import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { ChunkedBlobHeader } from 'otter';

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
    const previewFunctionName =
      gatewayFunction.previewFunction ||
      (gatewayFunction.function === 'add_chunks'
        ? 'add_chunks_preview'
        : `${gatewayFunction.function}_preview`);
    const previewTarget = `${gatewayFunction.packageId}::${gatewayFunction.module}::${previewFunctionName}`;

    return new Promise((resolve) => {
      try {
        const previewTx = new Transaction();
        previewTx.moveCall({
          target: previewTarget,
          arguments: [
            previewTx.object(header.policyObjectId),
            previewTx.pure.u64(targetMaxIndex),
          ],
        });
        previewTx.setGasBudget(10000000);

        const quoteEventTypeName = gatewayFunction.quoteEventType || 'QuoteEvent';
        const quoteEventType = `${gatewayFunction.packageId}::${gatewayFunction.module}::${quoteEventTypeName}`;

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

                const quoteEvent =
                  txDetails.events?.find((event: any) => event.type === quoteEventType) ||
                  txDetails.events?.find((event: any) =>
                    typeof event.type === 'string' && event.type.endsWith(`::${quoteEventTypeName}`),
                  );

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
      return false;
    }

    return new Promise((resolve, reject) => {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalFeeNeeded.toString())]);
      tx.moveCall({
        target: `${header.gatewayFunction!.packageId}::${header.gatewayFunction!.module}::${header.gatewayFunction!.function}`,
        arguments: [
          coin,
          tx.object(header.policyObjectId),
          tx.pure.u64(targetMaxIndex),
        ],
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

