import { CoingeckoCryptoMarketPayload } from './Payload.js'
import { CoingeckoCryptoMarketSchema } from './Schema.js'

export const coingeckoCryptoMarketPayloadTemplate = (): Partial<CoingeckoCryptoMarketPayload> => ({
  schema: CoingeckoCryptoMarketSchema,
})
