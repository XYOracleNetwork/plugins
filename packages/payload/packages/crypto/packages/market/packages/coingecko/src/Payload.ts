import { Payload } from '@xyo-network/payload-model'

import { CryptoAssetPrices } from './lib/index.js'
import { CoingeckoCryptoMarketSchema } from './Schema.js'

export type CoingeckoCryptoMarketPayload = Payload<{
  assets: CryptoAssetPrices
  schema: CoingeckoCryptoMarketSchema
  timestamp: number
}>
