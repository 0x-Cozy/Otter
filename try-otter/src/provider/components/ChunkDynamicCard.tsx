import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileInputButton } from '../../components/ui/file-input-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { useBlobEncryption } from '../hooks/useBlobEncryption';
import { useBlobUpload } from '../hooks/useBlobUpload';
import { useBlobPublish } from '../hooks/useBlobPublish';
import { useProviderConfig } from '../config';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../networkConfig';

export function ChunkDynamicCard() {
  const { maxFileSize } = useProviderConfig('chunk_dynamic_pricing', true);
  const packageId = useNetworkVariable('otterContractExamplesPackageId');
  const suiClient = useSuiClient();
  const [file, setFile] = useState<File | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [policyObjectId, setPolicyObjectId] = useState<string>('');
  const [capId, setCapId] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('service1');
  const [creating, setCreating] = useState(false);
  const [settingChunks, setSettingChunks] = useState(false);
  const [copied, setCopied] = useState(false);

  const { encryptBlob, encrypting, error: encryptError } = useBlobEncryption('chunk_dynamic_pricing', true);
  const { uploadBlob, uploading, error: uploadError, services } = useBlobUpload(selectedService);
  const { publishBlob, publishing, error: publishError } = useBlobPublish('chunk_dynamic_pricing');
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > maxFileSize) {
      alert(`File size must be less than ${(maxFileSize / (1024 * 1024)).toFixed(0)} MiB`);
      return;
    }
    setFile(selectedFile);
    setBlobId(null);
  };

  const createPolicyObject = async () => {
    if (!packageId) {
      alert('Package ID not available');
      return;
    }

    setCreating(true);
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::chunk_dynamic_pricing::create_chunk_dynamic_entry`,
      arguments: [tx.pure.string('Dynamic Pricing Blob')],
    });
    tx.setGasBudget(10000000);

    signAndExecute(
      {
        transaction: tx as any,
      },
      {
        onSuccess: async (result) => {
          try {
            const txDetails = await suiClient.getTransactionBlock({
              digest: result.digest,
              options: {
                showEffects: true,
                showObjectChanges: true,
              },
            });

            const createdObjects = txDetails.objectChanges?.filter(
              (change) => change.type === 'created'
            ) || [];

            const policyObject = createdObjects.find((obj: any) =>
              obj.objectType?.includes('chunk_dynamic_pricing::ChunkDynamicPricing')
            );
            const capObject = createdObjects.find((obj: any) =>
              obj.objectType?.includes('chunk_dynamic_pricing::Cap')
            );

            if (policyObject && capObject) {
              setPolicyObjectId(policyObject.objectId);
              setCapId(capObject.objectId);
            } else {
              console.error('Created objects:', createdObjects);
              alert('Created objects not found in transaction. Please check manually.');
            }
          } catch (err) {
            console.error('Error extracting object IDs:', err);
            alert('Policy object created, but failed to extract IDs. Please enter them manually.');
          } finally {
            setCreating(false);
          }
        },
        onError: (err) => {
          alert('Failed to create policy object: ' + (err instanceof Error ? err.message : String(err)));
          setCreating(false);
        },
      },
    );
  };

  const setTotalChunks = async (numChunks: number) => {
    if (!packageId || !policyObjectId || !capId) {
      alert('Missing policy object ID or Cap ID');
      return;
    }

    setSettingChunks(true);
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::chunk_dynamic_pricing::set_total_chunks_entry`,
      arguments: [
        tx.object(policyObjectId),
        tx.object(capId),
        tx.pure.u64(numChunks),
      ],
    });
    tx.setGasBudget(10000000);

    signAndExecute(
      {
        transaction: tx as any,
      },
      {
        onSuccess: () => {
          setSettingChunks(false);
        },
        onError: (err) => {
          alert('Failed to set total chunks: ' + (err instanceof Error ? err.message : String(err)));
          setSettingChunks(false);
        },
      },
    );
  };

  const handleUpload = async () => {
    if (!file || !policyObjectId || !capId) {
      alert('Please select a file and enter Policy Object ID and Cap ID');
      return;
    }

    try {
      const encryptionResult = await encryptBlob(file, policyObjectId);
      if (!encryptionResult) {
        return;
      }

      const numChunks = encryptionResult.metadata.numChunks;

      const uploadResult = await uploadBlob(
        encryptionResult.combinedBlob,
        encryptionResult.chunkIds,
        numChunks,
      );

      if (uploadResult) {
        const publishResult = await publishBlob(
          policyObjectId,
          capId,
          uploadResult.blobId,
          encryptionResult.chunkIds,
        );

        if (publishResult.success) {
          await setTotalChunks(numChunks);
          setBlobId(uploadResult.blobId);
        } else {
          alert('Failed to publish blob: ' + (publishResult.error || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Error during upload:', err);
      alert('Failed to upload: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const copyBlobId = () => {
    if (blobId) {
      navigator.clipboard.writeText(blobId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">Progressive Pricing</CardTitle>
        <CardDescription>
          Linear progressive pricing (sums to 0.1 SUI total). Auto-creates policy object. <span className="text-xs font-bold">(CHUNKED)</span> 
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createPolicyObject} 
          disabled={creating || !packageId} 
          variant="outline"
          className="w-full"
        >
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Policy Object...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Create Policy Object
            </>
          )}
        </Button>

        {(policyObjectId || capId) && (
          <Card className="bg-muted/30 border-border/40">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Created Objects:</p>
                {policyObjectId && (
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    Policy: {policyObjectId}
                  </p>
                )}
                {capId && (
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    Cap: {capId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Walrus Service</label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Image</label>
          <FileInputButton
            onFileSelect={handleFileSelect}
            accept="image/*"
            selectedFile={file}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !policyObjectId || !capId || encrypting || uploading || publishing || settingChunks}
          className="w-full"
        >
          {encrypting || uploading || publishing || settingChunks ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {encrypting ? 'Encrypting...' : uploading ? 'Uploading...' : publishing ? 'Publishing...' : 'Setting chunks...'}
            </>
          ) : (
            'Upload Image'
          )}
        </Button>

        {(encryptError || uploadError || publishError) && (
          <p className="text-sm text-destructive">
            {encryptError || uploadError || publishError}
          </p>
        )}

        {blobId && (
          <Card className="bg-muted/50 border-border/40">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold">Upload Successful!</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {blobId}
                  </p>
                  <Button
                    onClick={copyBlobId}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Blob ID
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
