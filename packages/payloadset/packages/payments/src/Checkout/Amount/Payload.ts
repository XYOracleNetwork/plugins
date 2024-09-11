import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { Iso4217AlphabeticalCode } from './Iso4217Currency.ts'

export const AmountSchema = 'network.xyo.payments.amount' as const
export type AmountSchema = typeof AmountSchema

export interface AmountFields {
  amount: number
  currency: Iso4217AlphabeticalCode
}

/**
 * The result of a amount
 */
export type Amount = PayloadWithSources<AmountFields, AmountSchema>

/**
 * Identity function for determining if an object is an Amount
 */
export const isAmount = isPayloadOfSchemaType<Amount>(AmountSchema)

/**
 * Identity function for determining if an object is an Amount with sources
 */
export const isAmountWithSources = isPayloadOfSchemaTypeWithSources<Amount>(AmountSchema)

/**
 * Identity function for determining if an object is an Amount with meta
 */
export const isAmountWithMeta = isPayloadOfSchemaTypeWithMeta<Amount>(AmountSchema)
