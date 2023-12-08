import { Payload } from '@xyo-network/payload-model'

import { AssetInfo, Token } from './Model'
import { CryptoMarketAssetSchema } from './Schema'

export type CryptoMarketAssetPayload = Payload<
  {
    assets: Partial<Record<Token, AssetInfo | undefined>>
    timestamp: number
  },
  CryptoMarketAssetSchema
>
