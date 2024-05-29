import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { TZeroStockMarketSchema } from '../Schema'
export interface PublicSnapshotFields {
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

export const PublicSnapshotSchema = `${TZeroStockMarketSchema}.public-snapshot`
export type PublicSnapshotSchema = typeof PublicSnapshotSchema

/**
 * The PublicSnapshot payload
 */
export type PublicSnapshot = Payload<PublicSnapshotFields, PublicSnapshotSchema>

/**
 * Identity function for PublicSnapshot payload
 */
export const isContractInfo = isPayloadOfSchemaType<PublicSnapshot>(PublicSnapshotSchema)
