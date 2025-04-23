import type { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'
import { HydratedPoolKey } from './types/index.ts'

export type UniswapV4CryptoMarketWitnessConfig = WitnessConfig<{
  pools?: Record<string, HydratedPoolKey>
  schema: UniswapCryptoMarketWitnessConfigSchema
}>
