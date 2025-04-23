import { Token } from "@uniswap/sdk-core";
import { ZeroAddress } from "ethers";

type ChainId = 1;

type TokenRegistryEntry = {
  address: string,
  chainId: ChainId,
  decimals: number,
  symbol: string,
  name?: string,
}

export const TokenRegistry: Record<string, TokenRegistryEntry> = {
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    symbol: 'USDT',
  },
  XYO: {
    address: '0x55296f69f40ea6d20e478533c15a6b08b654e758',
    chainId: 1,
    decimals: 18,
    symbol: 'XYO',
  },
} as const;

type TokenRegistryKey = keyof typeof TokenRegistry;
type TokenRegistryValue = typeof TokenRegistry[TokenRegistryKey];

export const tokenRegistryValueToToken = (value: TokenRegistryValue): Token => {
  const { address, chainId, decimals, symbol, name } = value;
  return new Token(chainId, address, decimals, symbol, name);
}

export type PoolIdType = {
  fee: number,
  hookAddress: string,
  tickSpacing: number,
  tokens: [TokenRegistryValue, TokenRegistryValue],
}
export const UniswapV4PoolIds: Record<string, PoolIdType> = {
  '0x3e5277df3d16847ee14eb9ffcde298c3d7b807d78626f88b03dfdd4b7c1aa734': {
    fee: 0,
    hookAddress: ZeroAddress,
    tickSpacing: 60,
    tokens: [TokenRegistry.XYO, TokenRegistry.USDT],
  }
} as const