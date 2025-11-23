import { useState } from 'react';

export interface WalrusService {
  id: string;
  name: string;
  publisherUrl: string;
  aggregatorUrl: string;
}

export interface UploadResult {
  blobId: string;
  endEpoch: string;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  blobUrl: string;
  suiUrl: string;
  chunkIds?: string[];
  numChunks?: number;
}

const NUM_EPOCH = 1;

export function useBlobUpload(selectedService: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services: WalrusService[] = [
    {
      id: 'service1',
      name: 'walrus.space',
      publisherUrl: '/publisher1',
      aggregatorUrl: '/aggregator1',
    },
    {
      id: 'service2',
      name: 'staketab.org',
      publisherUrl: '/publisher2',
      aggregatorUrl: '/aggregator2',
    },
    {
      id: 'service3',
      name: 'redundex.com',
      publisherUrl: '/publisher3',
      aggregatorUrl: '/aggregator3',
    },
    {
      id: 'service4',
      name: 'nodes.guru',
      publisherUrl: '/publisher4',
      aggregatorUrl: '/aggregator4',
    },
    {
      id: 'service5',
      name: 'banansen.dev',
      publisherUrl: '/publisher5',
      aggregatorUrl: '/aggregator5',
    },
    {
      id: 'service6',
      name: 'everstake.one',
      publisherUrl: '/publisher6',
      aggregatorUrl: '/aggregator6',
    },
  ];

  const getPublisherUrl = (path: string): string => {
    const service = services.find((s) => s.id === selectedService);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.publisherUrl}/v1/${cleanPath}`;
  };

  const getAggregatorUrl = (path: string): string => {
    const service = services.find((s) => s.id === selectedService);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.aggregatorUrl}/v1/${cleanPath}`;
  };

  const uploadBlob = async (
    encryptedData: Uint8Array,
    chunkIds?: string[],
    numChunks?: number,
  ): Promise<UploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      const buffer = new ArrayBuffer(encryptedData.length);
      new Uint8Array(buffer).set(encryptedData);

      const response = await fetch(`${getPublisherUrl(`/v1/blobs?epochs=${NUM_EPOCH}`)}`, {
        method: 'PUT',
        body: buffer,
      });

      if (response.status !== 200) {
        throw new Error('Failed to upload blob to Walrus. Please try a different service.');
      }

      const storageInfo = await response.json();
      const SUI_VIEW_TX_URL = 'https://suiscan.xyz/testnet/tx';
      const SUI_VIEW_OBJECT_URL = 'https://suiscan.xyz/testnet/object';

      let result: UploadResult;

      if ('alreadyCertified' in storageInfo) {
        result = {
          blobId: storageInfo.alreadyCertified.blobId,
          endEpoch: storageInfo.alreadyCertified.endEpoch,
          suiRefType: 'Previous Sui Certified Event',
          suiRef: storageInfo.alreadyCertified.event.txDigest,
          suiBaseUrl: SUI_VIEW_TX_URL,
          blobUrl: getAggregatorUrl(`/v1/blobs/${storageInfo.alreadyCertified.blobId}`),
          suiUrl: `${SUI_VIEW_TX_URL}/${storageInfo.alreadyCertified.event.txDigest}`,
          chunkIds,
          numChunks,
        };
      } else if ('newlyCreated' in storageInfo) {
        result = {
          blobId: storageInfo.newlyCreated.blobObject.blobId,
          endEpoch: storageInfo.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: 'Associated Sui Object',
          suiRef: storageInfo.newlyCreated.blobObject.id,
          suiBaseUrl: SUI_VIEW_OBJECT_URL,
          blobUrl: getAggregatorUrl(`/v1/blobs/${storageInfo.newlyCreated.blobObject.blobId}`),
          suiUrl: `${SUI_VIEW_OBJECT_URL}/${storageInfo.newlyCreated.blobObject.id}`,
          chunkIds,
          numChunks,
        };
      } else {
        throw new Error('Unhandled successful response from Walrus');
      }

      setUploading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload blob';
      setError(errorMessage);
      setUploading(false);
      return null;
    }
  };

  return {
    uploadBlob,
    uploading,
    error,
    services,
    getAggregatorUrl,
    getPublisherUrl,
  };
}

