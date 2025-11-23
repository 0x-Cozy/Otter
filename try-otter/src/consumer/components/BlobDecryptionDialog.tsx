import { useState, useEffect } from 'react';
import { Dialog, Button, Text, Flex, Card } from '@radix-ui/themes';
import { useBlobDecryption } from '../hooks/useBlobDecryption';
import { useSessionKey } from '../hooks/useSessionKey';
import { useGatewayPayment } from '../hooks/useGatewayPayment';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { NoAccessError } from '@mysten/seal';
import { ChunkedBlobHeader, parseChunkedBlobHeader } from 'otter-protocol';

interface BlobDecryptionDialogProps {
  blobId: string;
  policyObjectId: string;
  isOpen: boolean;
  onClose: () => void;
  isChunked?: boolean; // Optional, will be determined from blob header
}

const BlobDecryptionDialog: React.FC<BlobDecryptionDialogProps> = ({
  blobId,
  policyObjectId,
  isOpen,
  onClose,
}) => {
  const [blob, setBlob] = useState<ArrayBuffer | null>(null);
  const [header, setHeader] = useState<ChunkedBlobHeader | null>(null);
  const [selectedChunkIndices, setSelectedChunkIndices] = useState<number[]>([]);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [decryptedFilename, setDecryptedFilename] = useState<string>('decrypted-blob');
  const [loading, setLoading] = useState(false);

  const { sessionKey, loading: sessionKeyLoading } = useSessionKey(
    header?.packageId || '',
  );
  const { decryptBlob, decrypting, error: decryptError } = useBlobDecryption();
  const { getPaymentQuote, processPayment } = useGatewayPayment();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  useEffect(() => {
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [decryptedUrl]);

  useEffect(() => {
    if (!isOpen || !blobId) return;

    const downloadBlob = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    downloadBlob();
  }, [isOpen, blobId]);

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
          alert('Payment failed: ' + (err instanceof Error ? err.message : String(err)));
          return;
        }
      }
    }

    // try decrypt first, only pay if access denied - prevents billing on every call
    let result: { data: Uint8Array; fileExtension?: string } | null = null;
    const chunkIndices = header.numChunks === 0 ? [] : selectedChunkIndices;
    
    try {
      result = await decryptBlob(blob, header, sessionKey, chunkIndices, policyObjectId);
    } catch (err) {
      if (err instanceof NoAccessError && (isAllowlist || isSubscription)) {
        try {
          if (isAllowlist) {
            const tx = new Transaction();
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64('100000000')]); // 0.1 SUI
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
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64('100000000')]); // 0.1 SUI
            tx.moveCall({
              target: `${header.packageId}::subscription::subscribe`,
              arguments: [
                tx.object(header.policyObjectId),
                coin,
                tx.object('0x6'), // clock
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
          
          // Retry after payment
          try {
            result = await decryptBlob(blob, header, sessionKey, chunkIndices, policyObjectId);
            if (!result) {
              alert('Decryption failed after payment. Please try again.');
              return;
            }
          } catch (retryErr) {
            console.error('Decryption failed after payment:', retryErr);
            alert('Decryption failed after payment: ' + (retryErr instanceof Error ? retryErr.message : String(retryErr)));
            return;
          }
        } catch (err) {
          console.error('Payment failed:', err);
          alert('Payment failed: ' + (err instanceof Error ? err.message : String(err)));
          return;
        }
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        alert('Decryption failed: ' + errorMsg);
        return;
      }
    }
    
    if (!result && !isAllowlist && !isSubscription && decryptError) {
      alert('Decryption failed: ' + decryptError);
      return;
    }
    
    if (result) {
      const buffer = new ArrayBuffer(result.data.length);
      new Uint8Array(buffer).set(result.data);
      const blobObj = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blobObj);
      setDecryptedUrl(url);
      setDecryptedFilename(`decrypted-blob${result.fileExtension || ''}`);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Decrypt Blob</Dialog.Title>

        {loading && <Text>Loading blob...</Text>}
        {sessionKeyLoading && <Text>Initializing session key...</Text>}

        {header && header.numChunks > 0 && (
          <Flex direction="column" gap="3" style={{ marginTop: '1rem' }}>
            <Text size="2">Select chunks to decrypt:</Text>
            <Flex wrap="wrap" gap="2">
              {Array.from({ length: header.numChunks }, (_, i) => {
                const isSelected = selectedChunkIndices.includes(i);
                return (
                  <Button
                    key={i}
                    size="1"
                    variant={isSelected ? 'solid' : 'outline'}
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
            </Flex>
            <Text size="1">
              Selected: {selectedChunkIndices.length} / {header.numChunks} chunks
            </Text>
          </Flex>
        )}

        {decryptError && (
          <Text color="red" size="2" style={{ marginTop: '1rem' }}>
            Error: {decryptError}
          </Text>
        )}

        {decryptedUrl && (
          <Card style={{ marginTop: '1rem', padding: '1rem' }}>
            <Text size="2" weight="bold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Decryption successful!
            </Text>
            <a
              href={decryptedUrl}
              download={decryptedFilename}
              onClick={() => {
                setTimeout(() => {
                  URL.revokeObjectURL(decryptedUrl);
                }, 100);
              }}
            >
              <Button>Download Decrypted Blob</Button>
            </a>
          </Card>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={onClose}>
              Close
            </Button>
          </Dialog.Close>
          {!decryptedUrl && blob && header && sessionKey && !sessionKeyLoading && (
            <Button 
              onClick={handleDecrypt} 
              disabled={decrypting || (header.numChunks > 0 && selectedChunkIndices.length === 0)}
            >
              {decrypting ? 'Decrypting...' : 'Decrypt'}
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BlobDecryptionDialog;

