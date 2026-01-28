import { asSchema } from '@xyo-network/payload-model'

import { TZeroStockMarketSchema } from '../../Schema.ts'

export const PriceHistorySchema = asSchema(`${TZeroStockMarketSchema}.history`, true)
export type PriceHistorySchema = typeof PriceHistorySchema
