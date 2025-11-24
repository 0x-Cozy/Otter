## Otter Protocol

Otter is a programmable data exchange layer that connects data providers and consumers through secure, self-discoverable access-control removing the need for provider-defined interfaces.
In simpler terms we make access permission request happen directly on the data level instead of the data provider being the one to explicitly setup a frontend or interface. This way, anyone can programmatically request access to data and decrypt when granted permission without the need to go through a frontend set up by the data provider.

We also introduced the concept of Data streaming (or chunking) which allows consumers pay for a small chunk as preview before commiting fully to paying for the whole data -- this ensures that The Data Consumer is also getting the exact quality of the data they want before fully commiting / paying


## the file structue

### `otter-protocol-sdk`
The main SDK package. Handles encrypting data into chunks, parsing blob headers, dechunking. You can install it as `otter-protocol` from npm. It's what everything else uses under the hood.

### `bot`
Simple CLI tool showing how easy it is for agents/AI to work with Otter. Just point it at a blob ID, it downloads, parses the header, handles payments, decrypts. The whole flow in a few scripts. Since access discovery is in the blob itself, agents don't need special interfaces - they just need the blob.

### `try-otter`
The web UI where you can actually try Otter. Two sides:
- **Consumer**: Search for blobs by policy object ID or blob ID, decrypt them, preview images
- **Provider**: Upload images, encrypt them, publish with different pricing models (allowlist, subscription, chunk-based pricing)

It's basically a demo/frontend for testing the whole flow end-to-end.

### `frontend`
The landing page/marketing site, links to try-otter.

## How the SDK is used

- `parseChunkedBlobHeader()` - reads the header from the blob to get pricing info, module type, chunk count
- `extractEncryptedChunks()` - pulls out the encrypted chunks from the blob data
- `dechunk()` - decrypts and reassembles all the chunks back into the original data
- `encryptAndChunk()` - takes your image/data and encrypts it into chunks with the pricing policy you picked


