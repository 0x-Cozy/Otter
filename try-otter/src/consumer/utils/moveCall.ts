import { Transaction } from '@mysten/sui/transactions';
import { fromHex } from '@mysten/sui/utils';

export type MoveCallConstructor = (tx: Transaction, id: string) => void;

export function constructMoveCall(
  packageId: string,
  module: string,
  policyObjectId: string,
): MoveCallConstructor {
  return (tx: Transaction, id: string) => {
    tx.moveCall({
      target: `${packageId}::${module}::seal_approve`,
      arguments: [tx.pure.vector('u8', fromHex(id)), tx.object(policyObjectId)],
    });
  };
}

