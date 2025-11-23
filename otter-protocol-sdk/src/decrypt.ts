import { ChunkedBlobHeader, ChunkMetadata } from './types';

export function parseChunkedBlobHeader(blob: ArrayBuffer): { header: ChunkedBlobHeader; headerSize: number } {
  const data = new Uint8Array(blob);
  let headerEnd = 0;
  let braceCount = 0;
  let foundStart = false;

  for (let i = 0; i < Math.min(data.length, 10000); i++) {
    if (data[i] === 0x7b) {
      braceCount++;
      foundStart = true;
    } else if (data[i] === 0x7d) {
      braceCount--;
      if (foundStart && braceCount === 0) {
        headerEnd = i + 1;
        break;
      }
    }
  }

  if (headerEnd === 0) {
    throw new Error('Could not parse chunked blob header');
  }

  const headerText = new (globalThis as any).TextDecoder().decode(data.slice(0, headerEnd));
  const header: ChunkedBlobHeader = JSON.parse(headerText);
  return { header, headerSize: headerEnd };
}

export interface DechunkParams {
  decryptedChunks: Uint8Array[];
  chunkIndices: number[];
  chunkMetadata: ChunkMetadata[];
}

export function dechunk(params: DechunkParams): Uint8Array {
  const { decryptedChunks, chunkIndices, chunkMetadata } = params;

  // this is to ensure consistency like if user requested N chunks they must provide N decrypted chunks
  if (decryptedChunks.length !== chunkIndices.length) {
    throw new Error(
      `Number of decrypted chunks (${decryptedChunks.length}) must match number of chunk indices (${chunkIndices.length})`
    );
  }

  const sortedChunks = chunkIndices
    .map((index, i) => ({
      index,
      data: decryptedChunks[i],
    }))
    .sort((a, b) => a.index - b.index);

  //combine chunks in order
  const totalSize = sortedChunks.reduce((sum, chunk) => sum + chunk.data.length, 0);
  const combined = new Uint8Array(totalSize);
  let offset = 0;

  for (const chunk of sortedChunks) {
    combined.set(chunk.data, offset);
    offset += chunk.data.length;
  }

  return combined;
}

export function extractEncryptedChunks(
  blob: ArrayBuffer,
  header: ChunkedBlobHeader,
  chunkIndices: number[],
): Array<{ id: string; data: Uint8Array; chunkIndex: number }> {
  if (header.numChunks === 0) {
    throw new Error('extractEncryptedChunks should not be called for unchunked blobs. Use direct decryption instead.');
  }

  const data = new Uint8Array(blob);
  const requestedChunks: Array<{ id: string; data: Uint8Array; chunkIndex: number }> = [];

  for (const index of chunkIndices) {
    if (index < 0 || index >= header.chunks.length) {
      throw new Error(`Chunk index ${index} is out of range`);
    }

    const chunkMeta = header.chunks[index];
    const chunkData = data.slice(chunkMeta.offset, chunkMeta.offset + chunkMeta.size);
    requestedChunks.push({
      id: chunkMeta.id,
      data: chunkData,
      chunkIndex: index,
    });
  }

  return requestedChunks;
}
