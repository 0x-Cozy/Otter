import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useProviderConfig, PUBLISH_FUNCTION_NAME } from '../config';

export interface PublishResult {
  success: boolean;
  digest?: string;
  error?: string;
}

export function useBlobPublish(moduleName?: string) {
  const { packageId, moduleName: configModuleName, gasBudgetChunked, gasBudgetNonChunked, isReady } = useProviderConfig(moduleName, true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const publishBlob = async (
    policyObjectId: string,
    capId: string,
    blobId: string,
    chunkIds?: string[],
  ): Promise<PublishResult> => {
    if (!isReady || !packageId) {
      return Promise.resolve({
        success: false,
        error: 'Configuration not ready. Please check network settings.',
      });
    }
    setPublishing(true);
    setError(null);

    return new Promise((resolve) => {
      const tx = new Transaction();

      if (chunkIds && chunkIds.length > 0) {
        const chunkIdsStr = chunkIds.join(',');
        const blobIdWithMetadata = `${blobId}|${chunkIdsStr}`;
        tx.moveCall({
          target: `${packageId}::${configModuleName}::${PUBLISH_FUNCTION_NAME}`,
          arguments: [
            tx.object(policyObjectId),
            tx.object(capId),
            tx.pure.string(blobIdWithMetadata),
          ],
        });
        tx.setGasBudget(gasBudgetChunked);
      } else {
        tx.moveCall({
          target: `${packageId}::${configModuleName}::${PUBLISH_FUNCTION_NAME}`,
          arguments: [tx.object(policyObjectId), tx.object(capId), tx.pure.string(blobId)],
        });
        tx.setGasBudget(gasBudgetNonChunked);
      }

      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: async (result) => {
            setPublishing(false);
            resolve({
              success: true,
              digest: result.digest,
            });
          },
          onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : 'Failed to publish blob';
            setError(errorMessage);
            setPublishing(false);
            resolve({
              success: false,
              error: errorMessage,
            });
          },
        },
      );
    });
  };

  return {
    publishBlob,
    publishing,
    error,
  };
}

