import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FileImage, Loader2 } from 'lucide-react';

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

interface PolicyObjectListViewProps {
  policyObjectId: string;
  onBlobSelect: (blobId: string) => void;
}

const PolicyObjectListView: React.FC<PolicyObjectListViewProps> = ({ 
  policyObjectId,
  onBlobSelect,
}) => {
  const suiClient = useSuiClient();
  const [policyObjectData, setPolicyObjectData] = useState<PolicyObjectData | null>(null);
  const [chunkedBlobs, setChunkedBlobs] = useState<ChunkedBlobInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Loading policy object...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (!policyObjectData) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">No policy object data found</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          {policyObjectData.policyObjectName || 'Unnamed Policy Object'}
        </h3>
        <p className="text-xs text-muted-foreground font-mono break-all">
          {policyObjectData.policyObjectId}
        </p>
      </div>

      {policyObjectData.blobIds.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No blobs in this policy object.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {policyObjectData.blobIds.length} {policyObjectData.blobIds.length === 1 ? 'blob' : 'blobs'}
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {chunkedBlobs.map((blobInfo, blobIndex) => (
              <Card
                key={blobIndex}
                className="p-3 hover:bg-muted/50 transition-colors cursor-pointer border-border/60"
                onClick={() => onBlobSelect(blobInfo.blobId)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        Blob {blobIndex + 1}
                      </span>
                      {blobInfo.isChunked && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {blobInfo.chunkIds.length} chunks
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {blobInfo.blobId}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlobSelect(blobInfo.blobId);
                    }}
                    className="flex-shrink-0"
                  >
                    Decrypt
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyObjectListView;

