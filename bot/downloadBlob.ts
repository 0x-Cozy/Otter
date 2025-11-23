import 'dotenv/config';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import * as fs from 'fs';
import * as path from 'path';
import { decryptBlob } from './decryptBlob.js';

const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');


function createKeypair(privateKey: string): Ed25519Keypair {
  return Ed25519Keypair.fromSecretKey(privateKey);
}

export async function downloadBlobMain(blobId: string, maxChunks?: number): Promise<string> {
  if (!blobId) {
    throw new Error('Blob ID is required');
  }

  // Init
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Please set pk in env');
  }

  const keypair = createKeypair(privateKey);
  console.log(`Using wallet: ${keypair.toSuiAddress()}`);

  const result = await decryptBlob(blobId, keypair, suiClient, maxChunks);

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }

  const fileExtension = result.fileExtension || '';
  const filename = `blob_${blobId.slice(0, 8)}${fileExtension}`;
  const filepath = path.join(DOWNLOADS_DIR, filename);

  fs.writeFileSync(filepath, Buffer.from(result.data));
  console.log(`file saved to ${filepath}`);

  return filepath;
}







const blobId = process.argv[2] || process.env.BLOB_ID;
const maxChunksArg = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;
const maxChunks = maxChunksArg && !isNaN(maxChunksArg) ? maxChunksArg : undefined;

if (blobId) {
  downloadBlobMain(blobId, maxChunks)
    .then(() => {
      console.log('successfull');
      process.exit(0);
    })
    .catch((error) => {
      console.error('err', error.message);
      process.exit(1);
    });
} else {
  console.error('npm run download <blobId> [maxChunks]');
  console.error('Or set BLOB_ID environment variable');
  process.exit(1);
}

//QvLzOlOZzMiwIkz1Xc7VAr26_s8ud4a02-UhcTo0CBk
//tXwVaJdkm7hLoyaP2pVHsL8SnlB5eyxhYvts0ECmYn4
//Creating session key...
//1PxK8n2cGBpwEIAzeI-mq8COGFkn9SrhYMIUKcsFcQw

//CF_hBMLLuf79RlevN0t1Cxhoh-8wT4aPlmuYA1MH6iw

//89ai2qT6aUHmr41-08rqSZ82G3_FR2Xe-UFjMNhP5vA