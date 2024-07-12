import { Currency } from './Currency.js'
import { Token } from './Token.js'

export type ValueBasis = Partial<Record<Currency | Token, string | undefined>>
