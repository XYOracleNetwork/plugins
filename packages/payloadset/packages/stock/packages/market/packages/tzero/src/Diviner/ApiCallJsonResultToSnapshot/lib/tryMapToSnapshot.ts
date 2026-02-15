import type { JsonObject } from '@xylabs/sdk-js'
import { isApiCallJsonResult } from '@xyo-network/api-call-witness'
import type { Snapshot, SnapshotFields } from '@xyo-network/tzero-stock-market-payload-plugin'
import { SnapshotSchema } from '@xyo-network/tzero-stock-market-payload-plugin'

interface SnapshotJson extends JsonObject, SnapshotFields {}

const isSnapshotApiCallJsonResult = isApiCallJsonResult<SnapshotJson>

const numberOrNull = (value: unknown): number | null => (typeof value === 'number' ? value : null)

export const tryMapToSnapshot = (response?: unknown): Snapshot | undefined => {
  if (isSnapshotApiCallJsonResult(response)) {
    const data: Partial<SnapshotFields> = response.data
    const {
      symbol, timestamp, volume,
    } = data
    if (symbol === undefined || timestamp === undefined || volume === undefined) return undefined
    const fields = {
      askPrice: numberOrNull(data.askPrice),
      askPriceRate: numberOrNull(data.askPriceRate),
      askQtyBookTotal: numberOrNull(data.askQtyBookTotal),
      askQuantity: numberOrNull(data.askQuantity),
      bidPrice: numberOrNull(data.bidPrice),
      bidPriceRate: numberOrNull(data.bidPriceRate),
      bidQtyBookTotal: numberOrNull(data.bidQtyBookTotal),
      bidQuantity: numberOrNull(data.bidQuantity),
      high: numberOrNull(data.high),
      lastPrice: numberOrNull(data.lastPrice),
      lastQuantity: numberOrNull(data.lastQuantity),
      low: numberOrNull(data.low),
      open: numberOrNull(data.open),
      prevClosePx: numberOrNull(data.prevClosePx),
      symbol,
      timestamp,
      volume,
    }
    return { ...fields, schema: SnapshotSchema }
  }
}
