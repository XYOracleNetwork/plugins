import type { CoingeckoCryptoMarketPayload } from './Payload.ts'
import { CoingeckoCryptoMarketSchema } from './Schema.ts'

export const coingeckoCryptoMarketPayloadTemplate = (): Partial<CoingeckoCryptoMarketPayload> => ({ schema: CoingeckoCryptoMarketSchema })
