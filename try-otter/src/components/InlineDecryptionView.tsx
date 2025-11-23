import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useBlobDecryption } from '../consumer/hooks/useBlobDecryption';
import { useSessionKey } from '../consumer/hooks/useSessionKey';
import { useGatewayPayment } from '../consumer/hooks/useGatewayPayment';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { NoAccessError } from '@mysten/seal';
import { ChunkedBlobHeader, parseChunkedBlobHeader } from 'otter-protocol';

interface InlineDecryptionViewProps {
  blobId: string;
  policyObjectId: string;
  onDecrypted: (url: string) => void;
}

const InlineDecryptionView: React.FC<InlineDecryptionViewProps> = ({
  blobId,
  policyObjectId,
  onDecrypted,
}) => {
  const [blob, setBlob] = useState<ArrayBuffer | null>(null);
  const [header, setHeader] = useState<ChunkedBlobHeader | null>(null);
  const [selectedChunkIndices, setSelectedChunkIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sessionKey, loading: sessionKeyLoading } = useSessionKey(
    header?.packageId || '',
  );
  const { decryptBlob, decrypting, error: decryptError } = useBlobDecryption();
  const { getPaymentQuote, processPayment } = useGatewayPayment();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  useEffect(() => {
    if (!blobId) return;

    const downloadBlob = async () => {
      setLoading(true);
      setError(null);
      const aggregators = [
        'aggregator1',
        'aggregator2',
        'aggregator3',
        'aggregator4',
        'aggregator5',
        'aggregator6',
      ];

      for (const aggregator of aggregators) {
        try {
          const response = await fetch(`/${aggregator}/v1/blobs/${blobId}`);
          if (response.ok) {
            const blobData = await response.arrayBuffer();
            setBlob(blobData);
            const { header: parsedHeader } = parseChunkedBlobHeader(blobData);
            setHeader(parsedHeader);
            if (parsedHeader.numChunks === 0) {
              setSelectedChunkIndices([]);
            } else if (parsedHeader.numChunks > 0) {
              const isActuallyChunked = parsedHeader.numChunks > 1;
              if (isActuallyChunked) {
                setSelectedChunkIndices([0]);
              } else {
                setSelectedChunkIndices(Array.from({ length: parsedHeader.numChunks }, (_, i) => i));
              }
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn(`Failed to download from ${aggregator}:`, err);
        }
      }
      setError('Failed to download blob from any aggregator');
      setLoading(false);
    };

    downloadBlob();
  }, [blobId]);

  const handleDecrypt = async () => {
    if (!blob || !header || !sessionKey) return;

    const isAllowlist = header.module === 'allowlist';
    const isSubscription = header.module === 'subscription';
    const hasGatewayFunction = !!header.gatewayFunction;

    if (hasGatewayFunction) {
      const targetMaxIndex = header.numChunks === 0 
        ? 1 
        : (selectedChunkIndices.length > 0 
          ? Math.max(...selectedChunkIndices.map((idx) => idx + 1))
          : 1);

      const quote = await getPaymentQuote(header, targetMaxIndex);
      if (quote && quote.chunksNeeded > 0) {
        try {
          await processPayment(header, targetMaxIndex, quote.totalFeeNeeded);
        } catch (err) {
          console.error('Payment failed:', err);
          setError('Payment failed: ' + (err instanceof Error ? err.message : String(err)));
          return;
        }
      }
    }

    let result: { data: Uint8Array; fileExtension?: string } | null = null;
    const chunkIndices = header.numChunks === 0 ? [] : selectedChunkIndices;
    
    try {
      result = await decryptBlob(blob, header, sessionKey, chunkIndices, policyObjectId);
    } catch (err) {
      if (err instanceof NoAccessError && (isAllowlist || isSubscription)) {
        try {
          if (isAllowlist) {
            const tx = new Transaction();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64('100000000')]);
            tx.moveCall({
              target: `${header.packageId}::allowlist::join_allowlist`,
              arguments: [
                tx.object(header.policyObjectId),
                coin,
              ],
            });
            tx.setGasBudget(20000000);

            await new Promise((resolve, reject) => {
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
                    console.error('Allowlist payment failed:', error);
                    reject(error);
                  },
                },
              );
            });
          } else if (isSubscription) {
            const tx = new Transaction();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64('100000000')]);
            tx.moveCall({
              target: `${header.packageId}::subscription::subscribe`,
              arguments: [
                tx.object(header.policyObjectId),
                coin,
                tx.object('0x6'),
              ],
            });
            tx.setGasBudget(20000000);

            await new Promise((resolve, reject) => {
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
                    console.error('Subscription payment failed:', error);
                    reject(error);
                  },
                },
              );
            });
          }
          
          try {
            result = await decryptBlob(blob, header, sessionKey, chunkIndices, policyObjectId);
            if (!result) {
              setError('Decryption failed after payment. Please try again.');
              return;
            }
          } catch (retryErr) {
            console.error('Decryption failed after payment:', retryErr);
            setError('Decryption failed after payment: ' + (retryErr instanceof Error ? retryErr.message : String(retryErr)));
            return;
          }
        } catch (err) {
          console.error('Payment failed:', err);
          setError('Payment failed: ' + (err instanceof Error ? err.message : String(err)));
          return;
        }
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError('Decryption failed: ' + errorMsg);
        return;
      }
    }
    
    if (!result && !isAllowlist && !isSubscription && decryptError) {
      setError('Decryption failed: ' + decryptError);
      return;
    }
    
    if (result) {
      const buffer = new ArrayBuffer(result.data.length);
      new Uint8Array(buffer).set(result.data);
      const blobObj = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blobObj);
      onDecrypted(url);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading blob...
      </div>
    );
  }

  if (sessionKeyLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Initializing session key...
      </div>
    );
  }

  if (error && !blob) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!blob || !header) {
    return null;
  }

  return (
    <div className="p-4 space-y-4">
      {header.numChunks > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Select chunks to decrypt:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: header.numChunks }, (_, i) => {
              const isSelected = selectedChunkIndices.includes(i);
              return (
                <Button
                  key={i}
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedChunkIndices(selectedChunkIndices.filter((idx) => idx !== i));
                    } else {
                      setSelectedChunkIndices([...selectedChunkIndices, i].sort());
                    }
                  }}
                >
                  {i + 1}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {selectedChunkIndices.length} / {header.numChunks} chunks
          </p>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}

      {sessionKey && (
        <Button 
          onClick={handleDecrypt} 
          disabled={decrypting || (header.numChunks > 0 && selectedChunkIndices.length === 0)}
          className="w-full"
        >
          {decrypting ? 'Decrypting...' : 'Decrypt'}
        </Button>
      )}
    </div>
  );
};

export default InlineDecryptionView;

