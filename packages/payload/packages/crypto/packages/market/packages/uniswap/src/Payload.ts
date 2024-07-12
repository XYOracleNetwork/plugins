import { Payload } from '@xyo-network/payload-model'

import { UniswapCryptoPair } from './lib/index.js'
import { UniswapCryptoMarketSchema } from './Schema.js'

export type UniswapCryptoMarketPayload = Payload<{
  pairs: UniswapCryptoPair[]
  schema: UniswapCryptoMarketSchema
  timestamp: number
}>
