import { DivinerConfig } from '@xyo-network/diviner-model'

import { TZeroStockMarketDivinerConfigSchema } from './Schema'

export type TZeroStockMarketDivinerConfig = DivinerConfig<{
  schema: TZeroStockMarketDivinerConfigSchema
}>
