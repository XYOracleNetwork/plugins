import { AsObjectFactory } from '@xylabs/object'
import type { PayloadWithSources, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
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
export const asAmount = AsObjectFactory.create<Amount>(isAmount)
export const asOptionalAmount = AsObjectFactory.createOptional<Amount>(isAmount)

/**
 * Identity function for determining if an object is an Amount with sources
 */
export const isAmountWithSources = isPayloadOfSchemaTypeWithSources<Amount>(AmountSchema)
export const asAmountWithSources = AsObjectFactory.create<WithSources<Amount>>(isAmountWithSources)
export const asOptionalAmountWithSources = AsObjectFactory.createOptional<WithSources<Amount>>(isAmountWithSources)
