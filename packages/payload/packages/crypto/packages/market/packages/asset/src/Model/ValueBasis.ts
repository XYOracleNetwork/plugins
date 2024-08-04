import { Currency } from './Currency.ts'
import { Token } from './Token.ts'

export type ValueBasis = Partial<Record<Currency | Token, string | undefined>>
