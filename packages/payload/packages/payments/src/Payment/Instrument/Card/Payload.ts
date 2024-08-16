import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import { PaymentCardSchema } from './Schema.ts'

/**
 * The fields describing a payment card.
 */
export interface PaymentCardFields {
  /**
   * Card Number (PAN) of the payment card. This value is required to perform a payment.
   */
  cardNumber: string
  /**
   * The name as it appears on the payment card.
   */
  cardholderName?: string
  /**
   * Card Verification Value (CVV/CVC) of the payment card.
   */
  cvv: string
  /**
   * Expiration month of the payment card.
   */
  expMonth: number
  /**
   * Expiration year of the payment card.
   */
  expYear: number
}

/**
 * A PaymentCard Payload
 */
export type PaymentCard = Payload<PaymentCardFields, PaymentCardSchema>

/**
 * Identity function for determine if an object is a PaymentCard
 */
export const isPaymentCard = isPayloadOfSchemaType<PaymentCard>(PaymentCardSchema)

/**
 * Identity function for determine if an object is a PaymentCard with sources
 */
export const isPaymentCardWithSources = isPayloadOfSchemaTypeWithSources<PaymentCard>(PaymentCardSchema)

/**
 * Identity function for determine if an object is a PaymentCard with meta
 */
export const isPaymentCardWithMeta = isPayloadOfSchemaTypeWithMeta<PaymentCard>(PaymentCardSchema)
