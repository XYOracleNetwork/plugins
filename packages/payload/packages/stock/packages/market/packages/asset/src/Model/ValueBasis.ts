import { Currency } from './Currency'
import { Ticker } from './Ticker'

export type ValueBasis = Partial<Record<Currency | Ticker, string | undefined>>
