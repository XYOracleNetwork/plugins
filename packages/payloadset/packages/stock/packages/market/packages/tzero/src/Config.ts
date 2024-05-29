import { DivinerConfig } from '@xyo-network/diviner-model'

import { TZeroStockMarketDivinerConfigSchema } from './Schema'

export type CoingeckoCryptoMarketDivinerConfig = DivinerConfig<{
  schema: TZeroStockMarketDivinerConfigSchema
}>
