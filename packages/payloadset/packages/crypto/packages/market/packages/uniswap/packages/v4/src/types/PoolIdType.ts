import { TokenRegistryEntry } from "./TokenRegistryEntry.ts";

export type PoolIdType = {
  fee: number,
  hookAddress: string,
  tickSpacing: number,
  tokens: [TokenRegistryEntry, TokenRegistryEntry],
}