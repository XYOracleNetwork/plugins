import { BillingAddress, PaymentCard } from '@xyo-network/payment-payload-plugins'

import { CreatePaymentTokenRequest } from '../Api/index.ts'

/**
 * Converts a payment card and billing address to a token request
 * @param paymentCard The payment card
 * @param billingAddress The billing address
 * @returns The token request
 */
export const toTokenRequest = (paymentCard: PaymentCard, billingAddress: BillingAddress): CreatePaymentTokenRequest => {
  const {
    cvv, expMonth, expYear, cardNumber,
  } = paymentCard
  // NOTE: We are destructuring all but the schema and passing it along to the billingAddress. This
  // is to allow for missing fields to be omitted rather than set to undefined and for any new fields
  // that might be added later to be automatically picked up on. It is fine to pass this along since
  // the user is supplying this data about themselves.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { schema: _, ...fields } = billingAddress
  return {
    billingAddress: { ...fields },
    method: 'payment-card',
    paymentInstrument: {
      cvv, expMonth, expYear, pan: cardNumber,
    },
  }
}
