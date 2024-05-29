import { TZeroStockMarketPayload } from './Payload'
import { TZeroStockMarketSchema } from './Schema'

export const tZeroStockMarketPayloadTemplate = (): Partial<TZeroStockMarketPayload> => ({
  schema: TZeroStockMarketSchema,
})
