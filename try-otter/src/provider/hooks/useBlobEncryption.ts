import { useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { encryptAndChunk, GatewayFunction } from 'otter';
import { useProviderConfig } from '../config';

export interface EncryptionResult {
  combinedBlob: Uint8Array;
  chunkIds: string[];
  metadata: {
    numChunks: number;
    fileExtension: string;
  };
}

export function useBlobEncryption(moduleName?: string, chunked: boolean = true) {
  const suiClient = useSuiClient();
  const {
    packageId,
    moduleName: configModuleName,
    sealServerObjectIds,
    encryptionOptions,
    gatewayFunctionConfig,
    isReady,
  } = useProviderConfig(moduleName, true);
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serverConfigs = sealServerObjectIds.map((id) => ({
    objectId: id,
    weight: 1,
  }));

  const encryptBlob = async (
    file: File,
    policyObjectId: string,
  ): Promise<EncryptionResult | null> => {
    if (!isReady || !packageId) {
      setError('Configuration not ready. Please check network settings.');
      return null;
    }

    setEncrypting(true);
    setError(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);
      const baseNonce = crypto.getRandomValues(new Uint8Array(5));

      let gatewayFunction: GatewayFunction | undefined = undefined;
      if (gatewayFunctionConfig) {
        const policyObject = await suiClient.getObject({
          id: policyObjectId,
          options: { showContent: true },
        });
        const fields = (policyObject.data?.content as { fields: any })?.fields || {};
        const fee = fields.fee || '0';

        gatewayFunction = {
          packageId: packageId,
          module: gatewayFunctionConfig.module,
          function: gatewayFunctionConfig.function,
          quoteEventType: gatewayFunctionConfig.quoteEventType,
          previewFunction: gatewayFunctionConfig.previewFunction,
          arguments: [fee],
        };
      }

      const result = await encryptAndChunk({
        data: fileData,
        fileName: file.name,
        policyObject: policyObjectId,
        packageId: packageId,
        module: configModuleName,
        baseNonce: baseNonce,
        suiClient: suiClient as any,
        serverConfigs: serverConfigs,
        gatewayFunction: gatewayFunction,
        options: {
          ...encryptionOptions,
          chunked: chunked,
        },
      });

      setEncrypting(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to encrypt blob';
      setError(errorMessage);
      setEncrypting(false);
      return null;
    }
  };

  return { encryptBlob, encrypting, error };
}

