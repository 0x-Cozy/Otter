import { SealClient } from '@mysten/seal';
import { SuiClient } from '@mysten/sui/client';
import { fromHex, toHex } from '@mysten/sui/utils';
import {
  ChunkedBlobHeader,
  ChunkMetadata,
  EncryptAndChunkOptions,
  EncryptAndChunkResult,
  GatewayFunction,
  ServerConfig,
} from './types';

const DEFAULT_TARGET_CHUNKS = 5;
const DEFAULT_MAX_CHUNK_SIZE = 64 * 1024;
const DEFAULT_THRESHOLD = 2;

export interface EncryptAndChunkParams {
  data: Uint8Array;
  fileName: string;
  policyObject: string;
  packageId: string;
  module: string;
  baseNonce: Uint8Array;
  suiClient: SuiClient;
  serverConfigs: ServerConfig[];
  gatewayFunction?: GatewayFunction;
  options?: EncryptAndChunkOptions;
}

export async function encryptAndChunk(params: EncryptAndChunkParams): Promise<EncryptAndChunkResult> {
  const {
    data,
    fileName,
    policyObject,
    packageId,
    module,
    baseNonce,
    suiClient,
    serverConfigs,
    gatewayFunction,
    options = {},
  } = params;
  const {
    targetChunks = DEFAULT_TARGET_CHUNKS,
    maxChunkSize = DEFAULT_MAX_CHUNK_SIZE,
    threshold = DEFAULT_THRESHOLD,
    chunked = true,
  } = options;

  const fileSize = data.length;

  const fileExtension = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';

  const sealClient = new SealClient({
    suiClient: suiClient as any,
    serverConfigs,
    verifyKeyServers: false,
  });

  const policyObjectBytes = fromHex(policyObject);
  let encryptedChunks: Uint8Array[] = [];
  let chunkIds: string[] = [];
  let numChunks: number;

  if (!chunked) {
    const chunkIndex = 1;
    const chunkNonce = new Uint8Array(baseNonce.length);
    chunkNonce.set(baseNonce);
    let carry = chunkIndex;
    for (let j = 0; j < chunkNonce.length && carry > 0; j++) {
      const sum = chunkNonce[j] + (carry & 0xff);
      chunkNonce[j] = sum & 0xff;
      carry = (carry >> 8) + (sum >> 8);
    }
    const chunkIndexBytes = new Uint8Array([chunkIndex & 0xff, (chunkIndex >> 8) & 0xff]);
    const chunkId = toHex(new Uint8Array([...policyObjectBytes, ...chunkNonce, ...chunkIndexBytes]));

    const { encryptedObject: encryptedBlob } = await sealClient.encrypt({
      threshold,
      packageId,
      id: chunkId,
      data: data,
    });

    encryptedChunks = [encryptedBlob];
    chunkIds = [chunkId];
    numChunks = 0;
  } else {
    const targetChunkSize = fileSize / targetChunks;
    let chunkSize: number;

    if (targetChunkSize <= maxChunkSize) {
      chunkSize = targetChunkSize;
      numChunks = targetChunks;
    } else {
      chunkSize = maxChunkSize;
      numChunks = Math.ceil(fileSize / maxChunkSize);
    }

    for (let i = 0; i < numChunks; i++) {
      const start = Math.floor(i * chunkSize);
      const end = i === numChunks - 1 ? fileSize : Math.floor((i + 1) * chunkSize);
      const chunk = data.slice(start, end);

      const chunkIndex = i + 1;

      const chunkNonce = new Uint8Array(baseNonce.length);
      chunkNonce.set(baseNonce);
      let carry = chunkIndex;
      for (let j = 0; j < chunkNonce.length && carry > 0; j++) {
        const sum = chunkNonce[j] + (carry & 0xff);
        chunkNonce[j] = sum & 0xff;
        carry = (carry >> 8) + (sum >> 8);
      }
      const chunkIndexBytes = new Uint8Array([chunkIndex & 0xff, (chunkIndex >> 8) & 0xff]);
      const chunkId = toHex(new Uint8Array([...policyObjectBytes, ...chunkNonce, ...chunkIndexBytes]));

      const { encryptedObject: encryptedChunk } = await sealClient.encrypt({
        threshold,
        packageId,
        id: chunkId,
        data: chunk,
      });

      encryptedChunks.push(encryptedChunk);
      chunkIds.push(chunkId);
    }
  }

  const totalChunkSize = encryptedChunks.reduce((sum, enc) => sum + enc.length, 0);

  let headerSize = 0;
  let previousHeaderSize = -1;
  let header: ChunkedBlobHeader;
  let headerBytes = new Uint8Array(0);

  while (headerSize !== previousHeaderSize) {
    previousHeaderSize = headerSize;

    const chunks: ChunkMetadata[] = numChunks === 0
      ? [{
          id: chunkIds[0],
          size: encryptedChunks[0].length,
          offset: headerSize,
        }]
      : encryptedChunks.map((enc, idx) => ({
          id: chunkIds[idx],
          size: enc.length,
          offset: headerSize + encryptedChunks.slice(0, idx).reduce((sum, e) => sum + e.length, 0),
        }));

    header = {
      version: 1,
      numChunks: numChunks,
      fileExtension: fileExtension,
      serverConfigs: serverConfigs,
      packageId: packageId,
      module: module,
      threshold: threshold,
      policyObjectId: policyObject,
      gatewayFunction: gatewayFunction,
      chunks: chunks,
    };

    headerBytes = new (globalThis as any).TextEncoder().encode(JSON.stringify(header));
    headerSize = headerBytes.length;
  }

  const totalSize = headerSize + totalChunkSize;
  const combinedBlob = new Uint8Array(totalSize);

  combinedBlob.set(headerBytes, 0);

  let chunkOffset = headerSize;
  encryptedChunks.forEach((enc) => {
    combinedBlob.set(enc, chunkOffset);
    chunkOffset += enc.length;
  });

  return {
    combinedBlob,
    chunkIds,
    metadata: {
      numChunks,
      fileExtension,
    },
  };
}
