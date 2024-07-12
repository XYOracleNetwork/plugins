import { CryptoMarketAssetPayload } from './Payload.js'
import { CryptoMarketAssetSchema } from './Schema.js'

export const cryptoMarketAssetPayloadTemplate = (): Partial<CryptoMarketAssetPayload> => ({
  schema: CryptoMarketAssetSchema,
})
