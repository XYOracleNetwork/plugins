import { CryptoMarketAssetPayload } from './Payload.ts'
import { CryptoMarketAssetSchema } from './Schema.ts'

export const cryptoMarketAssetPayloadTemplate = (): Partial<CryptoMarketAssetPayload> => ({ schema: CryptoMarketAssetSchema })
