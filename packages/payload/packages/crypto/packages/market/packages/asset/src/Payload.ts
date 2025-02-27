import { Payload } from '@xyo-network/payload-model'

import { AssetInfo, Token } from './Model/index.ts'
import { CryptoMarketAssetSchema } from './Schema.ts'

export type CryptoMarketAssetPayload = Payload<
  {
    assets: Partial<Record<Token, AssetInfo | undefined>>
    timestamp: number
  },
  CryptoMarketAssetSchema
>
