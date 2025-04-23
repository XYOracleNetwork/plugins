import type { UniswapV4CryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type { TokenPairPoolKey } from './types/index.ts'

export type UniswapV4CryptoMarketWitnessConfig = WitnessConfig<{
  poolKeys?: TokenPairPoolKey[]
  schema: UniswapV4CryptoMarketWitnessConfigSchema
}>
