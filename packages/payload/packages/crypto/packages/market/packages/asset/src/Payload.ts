import type { Payload } from '@xyo-network/payload-model'

import type { AssetInfo, Token } from './Model/index.ts'
import type { CryptoMarketAssetSchema } from './Schema.ts'

export type CryptoMarketAssetPayload = Payload<
  {
    assets: Partial<Record<Token, AssetInfo | undefined>>
    timestamp: number
  },
  CryptoMarketAssetSchema
>
