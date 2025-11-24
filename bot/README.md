This is just a CLI example of how Otter allows download and decrypt by agents and Users alike since access points is directly integrated in the blob so there would be no need for a data provider defined interface like a frontend
this is obviously not an agent or AI based but is meant to be a simulation of how easy it would be for agents to work with Otter with access discovery at data level

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
PRIVATE_KEY=
```

### Usage

Download and decrypt a blob:

```bash
npm run download <blobId>
```

Optionally limit the number of chunks to decrypt:

```bash
npm run download <blobId> <maxChunks>
```

Or set the blob ID as an environment variable:

```bash
BLOB_ID=<blobId>
```
then you can run with `npm run download`

Decrypted files are saved to the `downloads/` folder

