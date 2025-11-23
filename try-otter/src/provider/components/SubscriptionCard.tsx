import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileInputButton } from '../../components/ui/file-input-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { useBlobEncryption } from '../hooks/useBlobEncryption';
import { useBlobUpload } from '../hooks/useBlobUpload';
import { useBlobPublish } from '../hooks/useBlobPublish';
import { useProviderConfig } from '../config';
import { SHARED_SUBSCRIPTION_ID, SHARED_SUBSCRIPTION_CAP_ID } from '../constants';

export function SubscriptionCard() {
  const { maxFileSize } = useProviderConfig('subscription', true);
  const [file, setFile] = useState<File | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>('service1');
  const [copied, setCopied] = useState(false);

  const { encryptBlob, encrypting, error: encryptError } = useBlobEncryption('subscription', false);
  const { uploadBlob, uploading, error: uploadError, services } = useBlobUpload(selectedService);
  const { publishBlob, publishing, error: publishError } = useBlobPublish('subscription');

  const capId = SHARED_SUBSCRIPTION_CAP_ID;

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > maxFileSize) {
      alert(`File size must be less than ${(maxFileSize / (1024 * 1024)).toFixed(0)} MiB`);
      return;
    }
    setFile(selectedFile);
    setBlobId(null);
  };

  const handleUpload = async () => {
    if (!file || !SHARED_SUBSCRIPTION_ID || !SHARED_SUBSCRIPTION_CAP_ID) {
      alert('Please select a file and ensure constants are configured');
      return;
    }

    try {
      const encryptionResult = await encryptBlob(file, SHARED_SUBSCRIPTION_ID);
      if (!encryptionResult) {
        return;
      }

      const uploadResult = await uploadBlob(
        encryptionResult.combinedBlob,
        encryptionResult.chunkIds,
        encryptionResult.metadata.numChunks,
      );

      if (uploadResult) {
        const publishResult = await publishBlob(
          SHARED_SUBSCRIPTION_ID,
          capId,
          uploadResult.blobId,
          [],
        );

        if (publishResult.success) {
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
        <CardTitle className="text-xl">Subscription</CardTitle>
        <CardDescription>
          Pay 0.1 SUI, access expires after 3 minutes.  <span className="text-xs font-bold">(UNCHUNKED)</span> 
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!SHARED_SUBSCRIPTION_ID || !SHARED_SUBSCRIPTION_CAP_ID) && (
          <p className="text-sm text-destructive">
            Please set SHARED_SUBSCRIPTION_ID and SHARED_SUBSCRIPTION_CAP_ID in constants.ts
          </p>
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
          disabled={!file || !SHARED_SUBSCRIPTION_ID || !SHARED_SUBSCRIPTION_CAP_ID || encrypting || uploading || publishing}
          className="w-full"
        >
          {encrypting || uploading || publishing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {encrypting ? 'Encrypting...' : uploading ? 'Uploading...' : 'Publishing...'}
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
