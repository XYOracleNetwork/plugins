export interface MarketdataSnapshot {
  askPrice: number
  askPriceRate: number | null
  askQtyBookTotal: number
  askQuantity: number
  bidPrice: number
  bidPriceRate: number | null
  high: number | null
  lastPrice: number | null
  lastQuantity: number | null
  low: number | null
  open: number | null
  prevClosePx: number
  symbol: string
  timestamp: string
  volume: number
}
