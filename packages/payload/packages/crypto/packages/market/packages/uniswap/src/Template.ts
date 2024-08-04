import { UniswapCryptoMarketPayload } from './Payload.ts'
import { UniswapCryptoMarketSchema } from './Schema.ts'

export const uniswapCryptoMarketPayloadTemplate = (): Partial<UniswapCryptoMarketPayload> => ({
  schema: UniswapCryptoMarketSchema,
})
