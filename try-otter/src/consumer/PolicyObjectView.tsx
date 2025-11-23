import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { Card, Text, Flex, Button } from '@radix-ui/themes';
import BlobDecryptionDialog from './components/BlobDecryptionDialog';

interface ChunkedBlobInfo {
  blobId: string;
  chunkIds: string[];
  isChunked: boolean;
}

interface PolicyObjectData {
  policyObjectId: string;
  policyObjectName?: string;
  blobIds: string[];
}

const PolicyObjectView: React.FC<{ 
  policyObjectId: string;
  initialBlobId?: string | null;
}> = ({ policyObjectId, initialBlobId }) => {
  const suiClient = useSuiClient();
  const [policyObjectData, setPolicyObjectData] = useState<PolicyObjectData | null>(null);
  const [chunkedBlobs, setChunkedBlobs] = useState<ChunkedBlobInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlobIndex, setSelectedBlobIndex] = useState<number | null>(null);

  const parseBlobId = (blobId: string): ChunkedBlobInfo => {
    if (blobId.includes('|')) {
      const [blobIdPart, chunkIdsStr] = blobId.split('|');
      const chunkIds = chunkIdsStr.split(',');
      return {
        blobId: blobIdPart,
        chunkIds,
        isChunked: true,
      };
    }
    return {
      blobId,
      chunkIds: [],
      isChunked: false,
    };
  };

  useEffect(() => {
    const fetchPolicyObject = async () => {
      setLoading(true);
        setError(null);
      try {
        const policyObject = await suiClient.getObject({
          id: policyObjectId,
          options: { showContent: true },
        });

        if (!policyObject.data) {
          setError('Policy object not found');
          setLoading(false);
          return;
        }

        const encryptedObjects = await suiClient
          .getDynamicFields({
            parentId: policyObjectId,
          })
          .then((res: { data: any[] }) => res.data.map((obj) => obj.name.value as string));

        const parsedBlobs = encryptedObjects.map(parseBlobId);
        setChunkedBlobs(parsedBlobs);

        const fields = (policyObject.data.content as { fields: any })?.fields || {};
        const data: PolicyObjectData = {
          policyObjectId,
          policyObjectName: fields?.name,
          blobIds: encryptedObjects,
        };
        setPolicyObjectData(data);
      } catch (err) {
        console.error('Error fetching policy object:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch policy object');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyObject();
  }, [policyObjectId, suiClient]);

  useEffect(() => {
    if (initialBlobId && chunkedBlobs.length > 0) {
      const blobIndex = chunkedBlobs.findIndex(b => b.blobId === initialBlobId);
      if (blobIndex !== -1) {
        setSelectedBlobIndex(blobIndex);
      }
    }
  }, [initialBlobId, chunkedBlobs]);

  if (loading) {
    return (
      <Card style={{ padding: '2rem' }}>
        <Text>Loading policy object...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ padding: '2rem' }}>
        <Text color="red">Error: {error}</Text>
      </Card>
    );
  }

  if (!policyObjectData) {
    return (
      <Card style={{ padding: '2rem' }}>
        <Text>No policy object data found</Text>
      </Card>
    );
  }

  return (
    <Card style={{ padding: '2rem' }}>
      <Flex direction="column" gap="3">
        <div>
          <Text size="5" weight="bold">
            Policy Object: {policyObjectData.policyObjectName || 'Unnamed'}
          </Text>
          <Text size="2" color="gray" style={{ display: 'block', marginTop: '0.5rem' }}>
            ID: {policyObjectData.policyObjectId}
          </Text>
        </div>

        {policyObjectData.blobIds.length === 0 ? (
          <Text>No blobs in this policy object.</Text>
        ) : (
          <Flex direction="column" gap="3">
            <Text size="3" weight="medium">
              Blobs ({policyObjectData.blobIds.length})
            </Text>
            {chunkedBlobs.map((blobInfo, blobIndex) => (
              <Card
                key={blobIndex}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setSelectedBlobIndex(blobIndex)}
              >
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    Blob {blobIndex + 1}
                  </Text>
                  <Text size="1" color="gray">
                    ID: {blobInfo.blobId}
                  </Text>
                  {blobInfo.isChunked ? (
                    <Text size="1" color="blue">
                      Chunked blob ({blobInfo.chunkIds.length} chunks)
                    </Text>
                  ) : (
                    <Text size="1" color="gray">
                      Single blob
                    </Text>
                  )}
                  <Button
                    size="2"
                    variant="soft"
                    style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlobIndex(blobIndex);
                    }}
                  >
                    Decrypt
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>

      {selectedBlobIndex !== null && chunkedBlobs[selectedBlobIndex] && (
        <BlobDecryptionDialog
          blobId={chunkedBlobs[selectedBlobIndex].blobId}
          policyObjectId={policyObjectId}
          isOpen={selectedBlobIndex !== null}
          onClose={() => setSelectedBlobIndex(null)}
        />
      )}
    </Card>
  );
};

export default PolicyObjectView;

