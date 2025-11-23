import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useProviderConfig } from '../config';

export function useCapId(policyObjectId: string | null, moduleName?: string) {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { packageId, capStructType, isReady } = useProviderConfig(moduleName, true);
  const [capId, setCapId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapId = async () => {
      if (!policyObjectId || !currentAccount?.address) {
        setCapId(null);
        setLoading(false);
        return;
      }

      if (!isReady || !packageId) {
        setError('Package ID not available. Please check network configuration.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const policyObj = await suiClient.getObject({
          id: policyObjectId,
          options: { showType: true },
        });
        
        if (!policyObj.data) {
          setError('Policy object not found. Please verify the ID is correct.');
          setLoading(false);
          return;
        }
        
        const res = await suiClient.getOwnedObjects({
          owner: currentAccount.address,
          options: {
            showContent: true,
            showType: true,
          },
          filter: {
            StructType: capStructType,
          },
        });

        const caps = res.data
          .map((obj) => {
            if (!obj?.data?.content) {
              return null;
            }
            
            const fields = (obj.data.content as { fields: any })?.fields || {};
            const capId = fields?.id?.id || obj.data.objectId;
            // diff modules use diff field names but as a provider you dont need to worry about that because youre the one to deploy dyg
            const policyId = fields?.allowlist_id || fields?.subscription_id || fields?.policy_id;
            
            return {
              id: capId,
              policy_id: policyId,
            };
          })
          .filter((item) => item !== null && item!.policy_id === policyObjectId)
          .map((item) => item!.id);

        if (caps.length > 0) {
          setCapId(caps[0]);
          setError(null);
        } else {
          setCapId(null);
          if (res.data && res.data.length > 0) {
            const allPolicyIds = res.data
              .map((obj) => {
                const fields = (obj?.data?.content as { fields: any })?.fields;
                return fields?.allowlist_id || fields?.subscription_id || fields?.policy_id;
              })
              .filter(Boolean);
            setError(
              `No Cap found for policy object ${policyObjectId}. ` +
              `You have Caps for: ${allPolicyIds.join(', ') || 'none'}. ` +
              `Please enter the Cap ID manually if you have it.`
            );
          } else {
            setError(
              `No Caps found for your account. ` +
              `If you created this policy object, the Cap should be in your wallet. ` +
              `Please enter the Cap ID manually.`
            );
          }
        }
      } catch (err) {
        console.error('Error fetching Cap ID:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Cap ID';
        setError(`Error: ${errorMessage}. Please enter the Cap ID manually.`);
        setCapId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCapId();
  }, [policyObjectId, currentAccount?.address, packageId, capStructType, isReady, suiClient]);

  return { capId, loading, error };
}

