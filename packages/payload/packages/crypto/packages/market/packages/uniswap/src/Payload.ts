import type { Payload } from '@xyo-network/payload-model'

import type { UniswapCryptoPair } from './lib/index.ts'
import type { UniswapCryptoMarketSchema } from './Schema.ts'

export type UniswapCryptoMarketPayload = Payload<{
  pairs: UniswapCryptoPair[]
  schema: UniswapCryptoMarketSchema
  timestamp: number
}>
