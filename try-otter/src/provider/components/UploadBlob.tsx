import { useState } from 'react';
import { Button, Card, Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { useBlobEncryption } from '../hooks/useBlobEncryption';
import { useBlobUpload } from '../hooks/useBlobUpload';
import { useBlobPublish } from '../hooks/useBlobPublish';
import { useCapId } from '../hooks/useCapId';
import { useProviderConfig } from '../config';

interface UploadBlobProps {
  policyObjectId: string;
  moduleName?: string;
}

export function UploadBlob({ policyObjectId, moduleName }: UploadBlobProps) {
  const { maxFileSize } = useProviderConfig(moduleName);
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string>('service1');
  const [manualCapId, setManualCapId] = useState<string>('');

  const { capId: autoCapId, loading: capLoading, error: capError } = useCapId(policyObjectId, moduleName);
  const { encryptBlob, encrypting, error: encryptError } = useBlobEncryption(moduleName);
  const { uploadBlob, uploading, error: uploadError, services } = useBlobUpload(selectedService);
  const { publishBlob, publishing, error: publishError } = useBlobPublish(moduleName);

  const capId = manualCapId.trim() || autoCapId || '';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxFileSize) {
      alert(`File size must be less than ${(maxFileSize / (1024 * 1024)).toFixed(0)} MiB`);
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleEncryptAndUpload = async () => {
    if (!file || !capId) {
      alert('Please select a file and ensure Cap ID is available');
      return;
    }

    try {
      const encryptionResult = await encryptBlob(file, policyObjectId);
      if (!encryptionResult) {
        return;
      }

      const uploadResult = await uploadBlob(
        encryptionResult.combinedBlob,
        encryptionResult.chunkIds,
        encryptionResult.metadata.numChunks,
      );

      if (uploadResult) {
        setUploadResult(uploadResult);
      }
    } catch (err) {
      console.error('Error during encryption/upload:', err);
      alert('Failed to encrypt and upload blob: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handlePublish = async () => {
    if (!uploadResult || !capId) {
      alert('No blob uploaded yet or Cap ID missing');
      return;
    }

    const result = await publishBlob(
      policyObjectId,
      capId,
      uploadResult.blobId,
      uploadResult.chunkIds,
    );

    if (result.success) {
      alert('Blob published to Sui successfully!');
    } else {
      alert('Failed to publish blob: ' + (result.error || 'Unknown error'));
    }
  };

  return (
    <Card style={{ padding: '2rem' }}>
      <Flex direction="column" gap="3">
        <Text size="5" weight="bold">
          Upload & Encrypt Blob
        </Text>

        <div>
          <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Policy Object ID:
          </Text>
          <Text size="1" color="gray">
            {policyObjectId}
          </Text>
        </div>

        <div>
          <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Cap ID:
          </Text>
          {capLoading ? (
            <Text size="1" color="gray">Loading Cap ID...</Text>
          ) : autoCapId ? (
            <Flex direction="column" gap="2">
              <Text size="1" color="green">Auto-detected: {autoCapId}</Text>
              <Text size="1" color="gray">Or enter manually:</Text>
              <TextField.Root
                placeholder="Enter Cap ID manually (optional)"
                value={manualCapId}
                onChange={(e) => setManualCapId(e.target.value)}
                size="2"
              />
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              <Text size="1" color="red">{capError || 'Cap ID not found'}</Text>
              <TextField.Root
                placeholder="Enter Cap ID manually"
                value={manualCapId}
                onChange={(e) => setManualCapId(e.target.value)}
                size="2"
              />
            </Flex>
          )}
        </div>

        <div>
          <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select Walrus Service:
          </Text>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select File:
          </Text>
          <input type="file" onChange={handleFileChange} style={{ width: '100%' }} />
        </div>

        {file && (
          <Text size="2" color="gray">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Text>
        )}

        <Button
          onClick={handleEncryptAndUpload}
          disabled={!file || !capId || encrypting || uploading}
          size="3"
        >
          {encrypting || uploading ? (
            <Flex align="center" gap="2">
              <Spinner />
              <Text>{encrypting ? 'Encrypting...' : 'Uploading...'}</Text>
            </Flex>
          ) : (
            'Encrypt and Upload to Walrus'
          )}
        </Button>

        {encryptError && (
          <Card style={{ backgroundColor: '#fee', padding: '1rem' }}>
            <Text color="red" size="2">
              Encryption Error: {encryptError}
            </Text>
          </Card>
        )}

        {uploadError && (
          <Card style={{ backgroundColor: '#fee', padding: '1rem' }}>
            <Text color="red" size="2">
              Upload Error: {uploadError}
            </Text>
          </Card>
        )}

        {uploadResult && (
          <Card style={{ padding: '1rem', backgroundColor: '#efe' }}>
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                Upload Successful!
              </Text>
              <Text size="1">Blob ID: {uploadResult.blobId}</Text>
              {uploadResult.chunkIds && uploadResult.chunkIds.length > 0 && (
                <Text size="1">Chunks: {uploadResult.chunkIds.length}</Text>
              )}
              <Text size="1">
                <a href={uploadResult.suiUrl} target="_blank" rel="noopener noreferrer">
                  View on Sui Explorer
                </a>
              </Text>
              <Button onClick={handlePublish} variant="soft" disabled={publishing || !capId}>
                {publishing ? (
                  <Flex align="center" gap="2">
                    <Spinner />
                    <Text>Publishing...</Text>
                  </Flex>
                ) : (
                  'Publish to Sui'
                )}
              </Button>
              {publishError && (
                <Text color="red" size="1">
                  Publish Error: {publishError}
                </Text>
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Card>
  );
}

