import { UniswapCryptoMarketPayload } from './Payload.js'
import { UniswapCryptoMarketSchema } from './Schema.js'

export const uniswapCryptoMarketPayloadTemplate = (): Partial<UniswapCryptoMarketPayload> => ({
  schema: UniswapCryptoMarketSchema,
})
