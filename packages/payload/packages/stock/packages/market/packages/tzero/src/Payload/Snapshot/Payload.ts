import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import { SnapshotSchema } from './Schema.ts'

/**
 * The fields for a Snapshot
 */
export interface SnapshotFields {
  askPrice: number | null
  askPriceRate: number | null
  askQtyBookTotal: number | null
  askQuantity: number | null
  bidPrice: number | null
  bidPriceRate: number | null
  bidQtyBookTotal: number | null
  bidQuantity: number | null
  high: number | null
  lastPrice: number | null
  lastQuantity: number | null
  low: number | null
  open: number | null
  prevClosePx: number | null
  symbol: string
  timestamp: string
  volume: number
}

/**
 * The Snapshot payload
 */
export type Snapshot = Payload<SnapshotFields, SnapshotSchema>

/**
 * Identity function for determine if an object is a Snapshot
 */
export const isSnapshot = isPayloadOfSchemaType<Snapshot>(SnapshotSchema)

/**
 * Identity function for determine if an object is a Snapshot with sources
 */
export const isSnapshotWithSources = isPayloadOfSchemaTypeWithSources<Snapshot>(SnapshotSchema)

/**
 * Identity function for determine if an object is a Snapshot with meta
 */
export const isSnapshotWithMeta = isPayloadOfSchemaTypeWithMeta<Snapshot>(SnapshotSchema)
