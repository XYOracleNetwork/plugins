import { JsonObject } from '@xylabs/object'
import { ApiCallResult, isApiCallJsonResult } from '@xyo-network/api-call-witness'
import { PublicSnapshotFields } from '@xyo-network/tzero-stock-market-payload-plugin'

interface PublicSnapshotJson extends JsonObject, PublicSnapshotFields {}

const isPublicSnapshotApiCallJsonResult = isApiCallJsonResult<PublicSnapshotJson>

const numberOrNull = (value: unknown): number | null => (typeof value === 'number' ? value : null)

export const tryMapToPublicSnapshot = (response: ApiCallResult): PublicSnapshotFields | undefined => {
  if (isPublicSnapshotApiCallJsonResult(response)) {
    const fields: Partial<PublicSnapshotFields> = response.data
    const { symbol, timestamp, volume } = fields
    if (!symbol || !timestamp || !volume) return undefined
    return {
      askPrice: numberOrNull(fields.askPrice),
      askPriceRate: numberOrNull(fields.askPriceRate),
      askQtyBookTotal: numberOrNull(fields.askQtyBookTotal),
      askQuantity: numberOrNull(fields.askQuantity),
      bidPrice: numberOrNull(fields.bidPrice),
      bidPriceRate: numberOrNull(fields.bidPriceRate),
      bidQtyBookTotal: numberOrNull(fields.bidQtyBookTotal),
      bidQuantity: numberOrNull(fields.bidQuantity),
      high: numberOrNull(fields.high),
      lastPrice: numberOrNull(fields.lastPrice),
      lastQuantity: numberOrNull(fields.lastQuantity),
      low: numberOrNull(fields.low),
      open: numberOrNull(fields.open),
      prevClosePx: numberOrNull(fields.prevClosePx),
      symbol,
      timestamp,
      volume,
    }
  }
}
