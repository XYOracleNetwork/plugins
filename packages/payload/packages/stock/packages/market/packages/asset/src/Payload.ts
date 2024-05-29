import { Payload } from '@xyo-network/payload-model'

import { AssetInfo, Ticker } from './Model'
import { CryptoMarketAssetSchema } from './Schema'

export type CryptoMarketAssetPayload = Payload<
  {
    assets: Partial<Record<Ticker, AssetInfo | undefined>>
    timestamp: number
  },
  CryptoMarketAssetSchema
>
