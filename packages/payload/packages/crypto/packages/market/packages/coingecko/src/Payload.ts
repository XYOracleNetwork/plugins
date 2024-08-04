import { Payload } from '@xyo-network/payload-model'

import { CryptoAssetPrices } from './lib/index.ts'
import { CoingeckoCryptoMarketSchema } from './Schema.ts'

export type CoingeckoCryptoMarketPayload = Payload<{
  assets: CryptoAssetPrices
  schema: CoingeckoCryptoMarketSchema
  timestamp: number
}>
