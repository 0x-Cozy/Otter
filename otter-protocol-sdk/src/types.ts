export interface ServerConfig {
  objectId: string;
  weight: number;
}

export interface GatewayFunction {
  packageId: string;
  module: string;
  function: string;
  quoteEventType?: string;
  previewFunction?: string;
  arguments?: any[];
}

export interface ChunkMetadata {
  id: string;
  size: number;
  offset: number;
}

export interface ChunkedBlobHeader {
  version: number;
  numChunks: number;
  fileExtension?: string;
  serverConfigs: ServerConfig[];
  packageId: string;
  module: string;
  threshold: number;
  policyObjectId: string;
  gatewayFunction?: GatewayFunction;
  chunks: ChunkMetadata[];
}

export interface EncryptAndChunkOptions {
  targetChunks?: number;
  maxChunkSize?: number;
  threshold?: number;
  chunked?: boolean;
}

export interface EncryptAndChunkResult {
  combinedBlob: Uint8Array;
  chunkIds: string[];
  metadata: {
    numChunks: number;
    fileExtension: string;
  };
}
