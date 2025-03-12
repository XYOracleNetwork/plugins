import { AsObjectFactory } from '@xylabs/object'
import type { PayloadWithSources, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { SupportedCurrency } from '../Currency.ts'
import { PaymentSchema } from './Schema.ts'

export interface PaymentFields {
  /**
   * The amount paid
   */
  amount: number
  /**
   * The currency of the amount paid
   */
  currency: SupportedCurrency
}

/**
 * A payment is a record of an amount to be paid
 */
export type Payment = PayloadWithSources<PaymentFields, PaymentSchema>

/**
 * Identity function for determine if an object is a Payment
 */
export const isPayment = isPayloadOfSchemaType<Payment>(PaymentSchema)
export const asPayment = AsObjectFactory.create<Payment>(isPayment)
export const asOptionalPayment = AsObjectFactory.createOptional<Payment>(isPayment)

/**
 * Identity function for determine if an object is a Payment with sources
 */
export const isPaymentWithSources = isPayloadOfSchemaTypeWithSources<Payment>(PaymentSchema)
export const asPaymentWithSources = AsObjectFactory.create<WithSources<Payment>>(isPaymentWithSources)
export const asOptionalPaymentWithSources = AsObjectFactory.createOptional<WithSources<Payment>>(isPaymentWithSources)
