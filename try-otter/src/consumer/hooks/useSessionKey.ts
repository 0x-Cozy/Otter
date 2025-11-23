import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { SessionKey, type ExportedSessionKey } from '@mysten/seal';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { get, set } from 'idb-keyval';

const TTL_MIN = 10;

export function useSessionKey(packageId: string) {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const [sessionKey, setSessionKeyState] = useState<SessionKey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSessionKey = async () => {
      if (!currentAccount?.address || !packageId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const imported: ExportedSessionKey = await get('sessionKey');

        if (imported) {
          try {
            const currentSessionKey = await SessionKey.import(
              imported,
              new SuiClient({ url: getFullnodeUrl('testnet') }) as any,
            );
            if (
              currentSessionKey &&
              !currentSessionKey.isExpired() &&
              currentSessionKey.getAddress() === currentAccount.address &&
              currentSessionKey.getPackageId() === packageId
            ) {
              setSessionKeyState(currentSessionKey);
              setLoading(false);
              return;
            } else {
              throw new Error('Session key expired or packageId mismatch');
            }
          } catch (err) {
            console.log('Imported session key is expired or packageId mismatch', err);
            await set('sessionKey', null);
          }
        }

        const newSessionKey = await SessionKey.create({
          address: currentAccount.address,
          packageId,
          ttlMin: TTL_MIN,
          suiClient,
        });

        const personalMessage = newSessionKey.getPersonalMessage();
        if (personalMessage) {
          signPersonalMessage(
            {
              message: personalMessage,
            },
            {
              onSuccess: async (result: { signature: string }) => {
                await newSessionKey.setPersonalMessageSignature(result.signature);
                setSessionKeyState(newSessionKey);
                await set('sessionKey', newSessionKey.export());
                setLoading(false);
              },
              onError: (err) => {
                setError(err instanceof Error ? err.message : 'Failed to sign session key');
                setLoading(false);
              },
            },
          );
        } else {
          setSessionKeyState(newSessionKey);
          await set('sessionKey', newSessionKey.export());
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create session key');
        setLoading(false);
      }
    };

    initializeSessionKey();
  }, [currentAccount?.address, packageId, suiClient, signPersonalMessage]);

  return { sessionKey, loading, error };
}

