import { ZeroAddress } from 'ethers'

import type { TokenPairPoolKey, TokenParameters } from '../types/index.ts'

export const TokenRegistry: Record<string, TokenParameters> = {
  USDT: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
} as const

export const UniswapV4DefaultPools: Record<string, TokenPairPoolKey> = {
  'XYO:USDT': {
    fee: 3000,
    hookAddress: ZeroAddress,
    tickSpacing: 60,
    tokens: [TokenRegistry.XYO, TokenRegistry.USDT],
  },
} as const
