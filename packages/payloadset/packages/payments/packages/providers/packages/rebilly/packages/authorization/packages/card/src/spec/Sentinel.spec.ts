import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { BillingAddress, PaymentCard } from '@xyo-network/payment-payload-plugins'
import { BillingAddressSchema, PaymentCardSchema } from '@xyo-network/payment-payload-plugins'
import { isRebillyPaymentAuthorizationTokenWithSources } from '@xyo-network/rebilly-payment-payload-plugin'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import { RebillyPaymentCardAuthorizationSentinelConfigSchema } from '../Config.ts'
import type { RebillyPaymentCardAuthorizationSentinelParams } from '../Params.ts'
import { RebillyPaymentCardAuthorizationSentinel } from '../Sentinel.ts'

const getTestPaymentCardRequest = (cardNumber: string, cvv: string): [PaymentCard, BillingAddress] => {
  const paymentCard: PaymentCard = {
    cardNumber,
    cvv,
    expMonth: new Date().getMonth() + 1,
    expYear: new Date().getFullYear() + 1,
    schema: PaymentCardSchema,
  }
  // https://simpsons.fandom.com/wiki/123_Fake_Street
  const billingAddress: BillingAddress = {
    address: '123 Fake Street',
    city: 'Oak Lawn',
    country: 'US',
    firstName: 'Marge',
    lastName: 'Simpson',
    postalCode: '60453',
    region: 'IL',
    schema: BillingAddressSchema,
  }
  return [paymentCard, billingAddress]
}

describe.skipIf(!process.env.REB_PUB_APIKEY)('RebillyPaymentCardAuthorizationSentinel', () => {
  const publishableApiKey = assertEx(process.env.REB_PUB_APIKEY)
  assertEx(publishableApiKey.includes('sandbox'), () => 'RebillyPaymentCardAuthorizationSentinel should only be tested in sandbox environment')
  const organizationId = assertEx(process.env.REB_ORGANIZATION_ID)
  let sentinel: RebillyPaymentCardAuthorizationSentinel
  beforeAll(async () => {
    const config = {
      schema: RebillyPaymentCardAuthorizationSentinelConfigSchema, synchronous: true, tasks: [],
    }
    const domain = 'https://api-sandbox.rebilly.com'
    sentinel = await RebillyPaymentCardAuthorizationSentinel.create({
      account: 'random',
      config,
      domain,
      organizationId,
      publishableApiKey,
    } as RebillyPaymentCardAuthorizationSentinelParams)
  })

  const cases = [
    ['Visa', '4111111111111111', '123'],
    ['Mastercard', '5555555555554444', '123'],
    ['American Express', '378282246310005', '1234'],
    ['Discover', '6011111111111117', '123'],
  ]
  describe('report', () => {
    it.each(cases)('returns created payment token for %s', async (_, pan, cvv) => {
      // Arrange
      const [paymentCard, billingAddress] = getTestPaymentCardRequest(pan, cvv)

      // Act
      const response = await sentinel.report([paymentCard, billingAddress])

      // Assert
      expect(response).toBeDefined()
      expect(response).toBeArray()
      const [bw, ...payloads] = response
      expect(bw).toBeDefined()
      expect(isBoundWitness(bw)).toBeTrue()
      const boundWitness: BoundWitness = assertEx([bw].find(isBoundWitness))
      expect(boundWitness.addresses).toContain(sentinel.address)

      expect(payloads).toBeArray()
      expect(payloads.length).toBeGreaterThanOrEqual(1)

      const payload = payloads.find(isRebillyPaymentAuthorizationTokenWithSources)
      expect(payload).toBeDefined()
      const token = assertEx(payload)
      expect(token.id).toBeString()
      expect(token.$sources).toBeArrayOfSize(2)
      expect(token.$sources).toEqual(await PayloadBuilder.dataHashes([paymentCard, billingAddress]))
    })
  })
})
