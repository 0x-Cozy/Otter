# Otter

Access control at the blob data level for Sui blockchain applications.

## Installation

```bash
npm install otter-protocol
```

## Features

- Encrypt and chunk data for decentralized storage
- Decrypt chunked and unchunked blobs
- Support for multiple pricing models (allowlist, subscription, chunk-based)
- Integration with Sui, Walrus, and Seal protocols

## Usage

### Encryption

```typescript
import { encryptAndChunk } from 'otter-protocol';

const result = await encryptAndChunk({
  data: new Uint8Array([...]),
  packageId: '0x...',
  module: 'allowlist',
  // ... other options
});
```

### Decryption

```typescript
import { parseChunkedBlobHeader, extractEncryptedChunks, dechunk } from 'otter-protocol';

const header = parseChunkedBlobHeader(blobData);
const chunks = extractEncryptedChunks(blobData, header);
const decrypted = await dechunk({
  chunks,
  header,
  // ... other options
});
```

## License

Apache-2.0
