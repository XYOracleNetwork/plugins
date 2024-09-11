import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { EscrowTerms } from '@xyo-network/payment-payload-plugins'
import { EscrowTermsSchema } from '@xyo-network/payment-payload-plugins'
import {
  beforeAll, beforeEach, describe, it, vi,
} from 'vitest'

import { PaymentSubtotalDiviner } from '../Diviner.ts'
import {
  isSubtotal,
  SubtotalSchema,
} from '../Payload.ts'

describe('PaymentSubtotalDiviner', () => {
  let sut: PaymentSubtotalDiviner
  const nbf = Date.now()
  const exp = Number.MAX_SAFE_INTEGER
  const termsBase: EscrowTerms = {
    schema: EscrowTermsSchema, appraisals: [], exp, nbf,
  }
  const cases: [estimates: HashLeaseEstimate[], subtotal: number][] = [
    [
      [
        {
          schema: HashLeaseEstimateSchema, price: 1, currency: 'USD', exp, nbf,
        },
        {
          schema: HashLeaseEstimateSchema, price: 10, currency: 'USD', exp, nbf,
        },
      ], 11],
    [
      [
        {
          schema: HashLeaseEstimateSchema, price: 10, currency: 'USD', exp, nbf,
        },
        {
          schema: HashLeaseEstimateSchema, price: 20, currency: 'USD', exp, nbf,
        },
      ], 30],
    [
      [
        {
          schema: HashLeaseEstimateSchema, price: 100, currency: 'USD', exp, nbf,
        },
        {
          schema: HashLeaseEstimateSchema, price: 100, currency: 'USD', exp, nbf,
        },
        {
          schema: HashLeaseEstimateSchema, price: 100, currency: 'USD', exp, nbf,
        },
      ], 300],
  ]
  beforeEach(() => {
    vi.clearAllMocks()
  })
  beforeAll(async () => {
    sut = await PaymentSubtotalDiviner.create({ account: 'random' })
  })
  describe('with escrow terms containing valid appraisals', () => {
    it.each(cases)('calculates the subtotal of all the appraisals', async (appraisals, total) => {
      const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
      const terms: EscrowTerms = { ...termsBase, appraisals: appraisalHashes }
      const results = await sut.divine([terms, ...appraisals])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isSubtotal)
      expect(result).toBeDefined()
      expect(result).toMatchObject({ amount: total, schema: SubtotalSchema })
      expect(result?.sources).toEqual([await PayloadBuilder.dataHash(terms), ...appraisalHashes])
    })
  })
  describe('with escrow terms containing invalid appraisals', () => {
    describe('when containing negative values in appraisals', () => {
      it('calculates the subtotal of all the appraisals', async () => {
        const appraisals = [{
          schema: HashLeaseEstimateSchema, price: -1, currency: 'USD', exp, nbf,
        }]
        const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
        const terms: EscrowTerms = { ...termsBase, appraisals: appraisalHashes }
        const results = await sut.divine([terms, ...appraisals])
        expect(results).toBeArrayOfSize(0)
      })
    })
    describe('when containing non-numeric values in appraisals', () => {
      it('calculates the subtotal of all the appraisals', async () => {
        const appraisals = [{
          schema: HashLeaseEstimateSchema, price: 'three dollars', currency: 'USD', exp, nbf,
        }]
        const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
        const terms: EscrowTerms = { ...termsBase, appraisals: appraisalHashes }
        const results = await sut.divine([terms, ...appraisals])
        expect(results).toBeArrayOfSize(0)
      })
    })
    describe('when containing mixed currencies in appraisals', () => {
      it('calculates the subtotal of all the appraisals', async () => {
        const appraisals = [{
          schema: HashLeaseEstimateSchema, price: 1, currency: 'USD', exp, nbf,
        }, {
          schema: HashLeaseEstimateSchema, price: 1, currency: 'EUR', exp, nbf,
        }]
        const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
        const terms: EscrowTerms = { ...termsBase, appraisals: appraisalHashes }
        const results = await sut.divine([terms, ...appraisals])
        expect(results).toBeArrayOfSize(0)
      })
    })
  })
})
