import { Payload } from '@xyo-network/payload-model'

import { UniswapCryptoPair } from './lib/index.ts'
import { UniswapCryptoMarketSchema } from './Schema.ts'

export type UniswapCryptoMarketPayload = Payload<{
  pairs: UniswapCryptoPair[]
  schema: UniswapCryptoMarketSchema
  timestamp: number
}>
