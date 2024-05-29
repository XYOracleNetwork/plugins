export interface MarketdataSnapshotFields {
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
