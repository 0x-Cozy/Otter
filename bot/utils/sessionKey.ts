import { SessionKey } from '@mysten/seal';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export async function createSessionKey(
  keypair: Ed25519Keypair,
  packageId: string,
  suiClient: SuiClient,
): Promise<SessionKey> {
  try {
    const address = keypair.toSuiAddress();
    if (!address || address.length === 0) {
      throw new Error('Invalid keypair: address is empty');
    }

    if (!packageId || packageId.length === 0) {
      throw new Error('Invalid package ID: packageId is empty');
    }

    const normalizedPackageId = packageId.startsWith('0x') 
      ? packageId.toLowerCase() 
      : `0x${packageId.toLowerCase()}`;

    console.log('Creating session key with:', {
      address,
      packageId: normalizedPackageId,
      originalPackageId: packageId,
    });

    const sessionKey = await SessionKey.create({
      address,
      packageId: normalizedPackageId,
      ttlMin: 10,
      suiClient: suiClient as any,
    });

    const personalMessage = sessionKey.getPersonalMessage();
    if (personalMessage) {
      const signatureResult = await keypair.signPersonalMessage(personalMessage);
      await sessionKey.setPersonalMessageSignature(signatureResult.signature);
    }

    return sessionKey;
  } catch (err) {
    console.error('SessionKey.create error details:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      name: err instanceof Error ? err.name : undefined,
    });
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to create session key: ${errorMessage}`);
  }
}


