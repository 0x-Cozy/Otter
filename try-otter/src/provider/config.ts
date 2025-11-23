export const DEFAULT_MODULE_NAME = 'streamer';

export function getCapStructType(packageId: string, moduleName: string): string {
  return `${packageId}::${moduleName}::Cap`;
}

export function getPolicyObjectStructType(packageId: string, moduleName: string): string {
  if (moduleName === 'allowlist') {
    return `${packageId}::allowlist::Allowlist`;
  } else if (moduleName === 'subscription') {
    return `${packageId}::subscription::Subscription`;
  } else if (moduleName === 'chunk_constant_pricing') {
    return `${packageId}::chunk_constant_pricing::ChunkConstantPricing`;
  } else if (moduleName === 'chunk_dynamic_pricing') {
    return `${packageId}::chunk_dynamic_pricing::ChunkDynamicPricing`;
  }
  return `${packageId}::${moduleName}::PaidAllowlist`;
}

export const DEFAULT_SEAL_SERVER_OBJECT_IDS = [
  '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75',
  '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8',
];

export const DEFAULT_SEAL_THRESHOLD = 2;

export const DEFAULT_ENCRYPTION_OPTIONS = {
  targetChunks: 5,
  maxChunkSize: 64 * 1024,
  threshold: DEFAULT_SEAL_THRESHOLD,
};

export interface GatewayFunctionConfig {
  module: string;
  function: string;
  quoteEventType: string;
  previewFunction: string;
}

export function getGatewayFunctionConfig(moduleName: string): GatewayFunctionConfig | null {
  if (moduleName === 'streamer') {
    return {
      module: 'streamer',
      function: 'add_chunks',
      quoteEventType: 'PaymentQuoteEvent',
      previewFunction: 'add_chunks_preview',
    };
  } else if (moduleName === 'chunk_constant_pricing') {
    return {
      module: 'chunk_constant_pricing',
      function: 'add_chunks',
      quoteEventType: 'PaymentQuoteEvent',
      previewFunction: 'add_chunks_preview',
    };
  } else if (moduleName === 'chunk_dynamic_pricing') {
    return {
      module: 'chunk_dynamic_pricing',
      function: 'add_chunks',
      quoteEventType: 'PaymentQuoteEvent',
      previewFunction: 'add_chunks_preview',
    };
  }
  // allowlist/subscription are unchunked, no gateway
  return null;
}

export const GAS_BUDGET_CHUNKED = 50000000;
export const GAS_BUDGET_NON_CHUNKED = 10000000;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const PUBLISH_FUNCTION_NAME = 'publish';

import { useNetworkVariable } from './networkConfig';

export interface ProviderConfig {
  packageId: string;
  moduleName: string;
  capStructType: string;
  policyObjectStructType: string;
  sealServerObjectIds: string[];
  encryptionOptions: typeof DEFAULT_ENCRYPTION_OPTIONS;
  gatewayFunctionConfig: GatewayFunctionConfig | null;
  gasBudgetChunked: number;
  gasBudgetNonChunked: number;
  maxFileSize: number;
  isReady: boolean;
}

export function useProviderConfig(moduleName: string = DEFAULT_MODULE_NAME, useOtterPackage: boolean = false): ProviderConfig {
  const defaultPackageId = useNetworkVariable('packageId');
  const otterPackageId = useNetworkVariable('otterContractExamplesPackageId');
  const packageId = useOtterPackage ? otterPackageId : defaultPackageId;
  const isReady = !!packageId;

  if (!isReady || !packageId) {
    return {
      packageId: '',
      moduleName,
      capStructType: '',
      policyObjectStructType: '',
      sealServerObjectIds: DEFAULT_SEAL_SERVER_OBJECT_IDS,
      encryptionOptions: DEFAULT_ENCRYPTION_OPTIONS,
      gatewayFunctionConfig: null,
      gasBudgetChunked: GAS_BUDGET_CHUNKED,
      gasBudgetNonChunked: GAS_BUDGET_NON_CHUNKED,
      maxFileSize: MAX_FILE_SIZE,
      isReady: false,
    };
  }

  return {
    packageId,
    moduleName,
    capStructType: getCapStructType(packageId, moduleName),
    policyObjectStructType: getPolicyObjectStructType(packageId, moduleName),
    sealServerObjectIds: DEFAULT_SEAL_SERVER_OBJECT_IDS,
    encryptionOptions: DEFAULT_ENCRYPTION_OPTIONS,
    gatewayFunctionConfig: getGatewayFunctionConfig(moduleName),
    gasBudgetChunked: GAS_BUDGET_CHUNKED,
    gasBudgetNonChunked: GAS_BUDGET_NON_CHUNKED,
    maxFileSize: MAX_FILE_SIZE,
    isReady: true,
  };
}

