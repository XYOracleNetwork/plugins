import { Payload } from '@xyo-network/payload-model'

import { CryptoAssetPrices } from './lib'
import { TZeroStockMarketSchema } from './Schema'

export type TZeroStockMarketPayload = Payload<{
  assets: CryptoAssetPrices
  schema: TZeroStockMarketSchema
  timestamp: number
}>
