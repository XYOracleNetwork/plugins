import { isPayloadOfSchemaType, PayloadWithSources } from '@xyo-network/payload-model'

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

export const isPayment = isPayloadOfSchemaType<Payment>(PaymentSchema)
