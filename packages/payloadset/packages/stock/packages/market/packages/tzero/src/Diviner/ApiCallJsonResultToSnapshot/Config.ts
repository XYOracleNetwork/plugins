import { DivinerConfig } from '@xyo-network/diviner-model'

import { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema.ts'

export type TZeroStockMarketDivinerConfig = DivinerConfig<{
  schema: TZeroApiCallJsonResultToSnapshotDivinerConfigSchema
}>
