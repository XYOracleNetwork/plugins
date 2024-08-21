import type { Payload } from '@xyo-network/payload-model'

import type { CryptoAssetPrices } from './lib/index.ts'
import type { CoingeckoCryptoMarketSchema } from './Schema.ts'

export type CoingeckoCryptoMarketPayload = Payload<{
  assets: CryptoAssetPrices
  schema: CoingeckoCryptoMarketSchema
  timestamp: number
}>
