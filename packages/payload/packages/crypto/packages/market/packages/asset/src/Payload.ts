import { Payload } from '@xyo-network/payload-model'

import { AssetInfo, Token } from './Model/index.js'
import { CryptoMarketAssetSchema } from './Schema.js'

export type CryptoMarketAssetPayload = Payload<
  {
    assets: Partial<Record<Token, AssetInfo | undefined>>
    timestamp: number
  },
  CryptoMarketAssetSchema
>
