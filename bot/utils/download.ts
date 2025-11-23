const AGGREGATORS = [
  'https://aggregator.walrus-testnet.walrus.space',
  'https://wal-aggregator-testnet.staketab.org',
  'https://walrus-testnet-aggregator.redundex.com',
  'https://walrus-testnet-aggregator.nodes.guru',
  'https://aggregator.walrus.banansen.dev',
  'https://walrus-testnet-aggregator.everstake.one',
];

export async function downloadBlob(blobId: string): Promise<ArrayBuffer> {
  for (const aggregator of AGGREGATORS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${aggregator}/v1/blobs/${blobId}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        return await response.arrayBuffer();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        continue;
      }
      console.warn(`Failed to download from ${aggregator}:`, err instanceof Error ? err.message : String(err));
      continue;
    }
  }
  
  throw new Error(`Failed to download blob ${blobId} from any aggregator`);
}


