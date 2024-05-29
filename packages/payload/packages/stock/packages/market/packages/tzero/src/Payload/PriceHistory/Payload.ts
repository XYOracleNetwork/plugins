export interface PriceHistory {
  close: number | null
  date: string
  high: number | null
  low: number | null
  open: number | null
  symbol: string
  volume: number
}

export interface PriceHistoryPageFields {
  currentPage: number
  priceHistories: PriceHistory[]
  size: number
  totalCount: number
  totalPages: number
}
