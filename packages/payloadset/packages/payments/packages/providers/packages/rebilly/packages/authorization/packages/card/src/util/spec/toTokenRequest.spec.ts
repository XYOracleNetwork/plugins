import type { BillingAddress, PaymentCard } from '@xyo-network/payment-payload-plugins'
import { BillingAddressSchema, PaymentCardSchema } from '@xyo-network/payment-payload-plugins'

import { toTokenRequest } from '../toTokenRequest'

describe('toTokenRequest', () => {
  const cases: [PaymentCard, BillingAddress][] = [
    [
      {
        cardNumber: '4111111111111111',
        cvv: '123',
        expMonth: 1,
        expYear: 3030,
        schema: PaymentCardSchema,
      },
      {
        // https://simpsons.fandom.com/wiki/123_Fake_Street
        address: '123 Fake Street',
        city: 'Oak Lawn',
        country: 'US',
        firstName: 'Marge',
        lastName: 'Simpson',
        postalCode: '60453',
        region: 'IL',
        schema: BillingAddressSchema,
      },
    ],
  ]
  it.each(cases)('convert a payment card and billing address to a token request', (paymentCard, billingAddress) => {
    const result = toTokenRequest(paymentCard, billingAddress)
    expect(result).toMatchSnapshot()
  })
})
