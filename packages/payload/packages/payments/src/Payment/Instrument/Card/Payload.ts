import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources, Payload, WithSources,
} from '@xyo-network/payload-model'

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
export const asPaymentCard = AsObjectFactory.create<PaymentCard>(isPaymentCard)
export const asOptionalPaymentCard = AsObjectFactory.createOptional<PaymentCard>(isPaymentCard)

/**
 * Identity function for determine if an object is a PaymentCard with sources
 */
export const isPaymentCardWithSources = isPayloadOfSchemaTypeWithSources<PaymentCard>(PaymentCardSchema)
export const asPaymentCardWithSources = AsObjectFactory.create<WithSources<PaymentCard>>(isPaymentCardWithSources)
export const asOptionalPaymentCardWithSources = AsObjectFactory.createOptional<WithSources<PaymentCard>>(isPaymentCardWithSources)
