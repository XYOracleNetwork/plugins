import type { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type UniswapCryptoMarketWitnessConfig = WitnessConfig<{
  pools?: string[]
  schema: UniswapCryptoMarketWitnessConfigSchema
}>
