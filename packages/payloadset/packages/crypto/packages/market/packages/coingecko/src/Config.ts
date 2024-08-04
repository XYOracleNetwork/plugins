import { CryptoAsset } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { WitnessConfig } from '@xyo-network/witness-model'

import { CoingeckoCryptoMarketWitnessConfigSchema } from './Schema.ts'

export type CoingeckoCryptoMarketWitnessConfig = WitnessConfig<{
  coins?: CryptoAsset[]
  currencies?: CryptoAsset[]
  schema: CoingeckoCryptoMarketWitnessConfigSchema
}>
