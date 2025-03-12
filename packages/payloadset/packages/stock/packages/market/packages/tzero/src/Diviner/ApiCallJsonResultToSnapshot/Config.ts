import type { DivinerConfig } from '@xyo-network/diviner-model'

import type { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema.ts'

export type TZeroStockMarketDivinerConfig = DivinerConfig<{
  schema: TZeroApiCallJsonResultToSnapshotDivinerConfigSchema
}>
