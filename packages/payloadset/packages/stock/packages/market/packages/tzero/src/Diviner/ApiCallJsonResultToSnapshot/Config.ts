import { DivinerConfig } from '@xyo-network/diviner-model'

import { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema.js'

export type TZeroStockMarketDivinerConfig = DivinerConfig<{
  schema: TZeroApiCallJsonResultToSnapshotDivinerConfigSchema
}>
