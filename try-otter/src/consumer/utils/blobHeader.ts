import { parseChunkedBlobHeader } from 'otter-protocol';

const aggregators = [
  'aggregator1',
  'aggregator2',
  'aggregator3',
  'aggregator4',
  'aggregator5',
  'aggregator6',
];

export async function getPolicyObjectIdFromBlob(blobId: string): Promise<string> {
  for (const aggregator of aggregators) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`/${aggregator}/v1/blobs/${blobId}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        const blobData = await response.arrayBuffer();
        const { header } = parseChunkedBlobHeader(blobData);
        
        if (!header.policyObjectId) {
          throw new Error('Blob header does not contain policy object ID');
        }
        
        return header.policyObjectId;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        continue;
      }
      console.warn(`Failed to download from ${aggregator}:`, err);
    }
  }
  
  throw new Error(`Failed to download blob ${blobId} from any aggregator`);
}

