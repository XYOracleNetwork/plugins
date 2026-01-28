import { asSchema } from '@xyo-network/payload-model'

import { TZeroStockMarketSchema } from '../../Schema.ts'

export const SnapshotSchema = asSchema(`${TZeroStockMarketSchema}.snapshot`, true)
export type SnapshotSchema = typeof SnapshotSchema
