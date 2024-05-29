import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { SnapshotSchema } from './Schema'

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
 * Identity function for Snapshot payload
 */
export const isSnapshot = isPayloadOfSchemaType<Snapshot>(SnapshotSchema)
