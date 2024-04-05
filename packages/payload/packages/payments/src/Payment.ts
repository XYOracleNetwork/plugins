import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

import { SupportedCurrency } from './Currency'

export type PaymentSchema = 'network.xyo.payments.payment'
export const PaymentSchema: PaymentSchema = 'network.xyo.payments.payment'

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
 * A payment is a record of a payment made
 */
export type Payment = PayloadWithSources<PaymentFields, PaymentSchema>

/**
 * Identity function for determine if an object is a Payment
 */
export const isPayment = isPayloadOfSchemaType<Payment>(PaymentSchema)

/**
 * Identity function for determine if an object is a Payment with sources
 */
export const isPaymentWithSources = isPayloadOfSchemaTypeWithSources<Payment>(PaymentSchema)

/**
 * Identity function for determine if an object is a Payment with meta
 */
export const isPaymentWithMeta = isPayloadOfSchemaTypeWithMeta<Payment>(PaymentSchema)
