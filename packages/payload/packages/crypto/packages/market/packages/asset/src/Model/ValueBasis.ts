import type { Currency } from './Currency.ts'
import type { Token } from './Token.ts'

export type ValueBasis = Partial<Record<Currency | Token, string | undefined>>
