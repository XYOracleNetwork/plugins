import type { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'
import { TokenPairPoolKey } from './types/index.ts'

export type UniswapV4CryptoMarketWitnessConfig = WitnessConfig<{
  poolKeys?: TokenPairPoolKey[]
  schema: UniswapCryptoMarketWitnessConfigSchema
}>
