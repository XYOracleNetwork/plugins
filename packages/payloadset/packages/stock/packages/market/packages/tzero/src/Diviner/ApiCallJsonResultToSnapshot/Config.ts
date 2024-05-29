import { DivinerConfig } from '@xyo-network/diviner-model'

import { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema'

export type TZeroStockMarketDivinerConfig = DivinerConfig<{
  schema: TZeroApiCallJsonResultToSnapshotDivinerConfigSchema
}>
