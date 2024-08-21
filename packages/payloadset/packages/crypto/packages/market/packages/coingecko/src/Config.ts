import type { CryptoAsset } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type { CoingeckoCryptoMarketWitnessConfigSchema } from './Schema.ts'

export type CoingeckoCryptoMarketWitnessConfig = WitnessConfig<{
  coins?: CryptoAsset[]
  currencies?: CryptoAsset[]
  schema: CoingeckoCryptoMarketWitnessConfigSchema
}>
