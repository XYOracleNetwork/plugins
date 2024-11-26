import '@xylabs/vitest-extended'

import { HDWallet } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Coupon, EscrowTerms } from '@xyo-network/payment-payload-plugins'
import {
  EscrowTermsSchema,
  FixedAmountCouponSchema, FixedPercentageCouponSchema, isTotal,
  TotalSchema,
} from '@xyo-network/payment-payload-plugins'
import {
  beforeAll, beforeEach, describe, expect,
  it, vi,
} from 'vitest'

import { PaymentDiscountDiviner } from '../../Discount/index.ts'
import { PaymentSubtotalDiviner } from '../../Subtotal/index.ts'
import { PaymentTotalDiviner } from '../Diviner.ts'

describe('PaymentTotalDiviner', () => {
  let sut: PaymentTotalDiviner
  const nbf = Date.now()
  const exp = nbf + 1000 * 60 * 10
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
  const validCoupons: Coupon[] = [
    {
      amount: 10, exp, nbf: Date.now(), schema: FixedAmountCouponSchema, currency: 'USD',
    },
    {
      percentage: 0.1, exp, nbf: Date.now(), schema: FixedPercentageCouponSchema,
    },
  ]
  const unsignedCoupons: Coupon[] = [
    {
      amount: 10, exp: Number.MAX_SAFE_INTEGER, nbf: 0, schema: FixedAmountCouponSchema, currency: 'USD',
    },
    {
      percentage: 0.1, exp: Number.MAX_SAFE_INTEGER, nbf: 0, schema: FixedPercentageCouponSchema,
    },
  ]
  beforeEach(() => {
    vi.clearAllMocks()
  })
  beforeAll(async () => {
    const node = await MemoryNode.create({ account: 'random' })
    expect(node).toBeDefined()
    const paymentSubtotalDiviner = await PaymentSubtotalDiviner.create({ account: 'random' })
    const discountsArchivist = await MemoryArchivist.create({ account: 'random' })
    const signer = await HDWallet.random()
    // Sign the valid coupons and insert them into the archivist
    for (const coupon of validCoupons) {
      const [bw, payloads] = await new BoundWitnessBuilder().signer(signer).payload(coupon).build()
      await discountsArchivist.insert([bw, ...payloads])
    }
    // Insert (but do not sign) the unsigned coupons into the archivist
    await discountsArchivist.insert(unsignedCoupons)
    const discountsBoundWitnessDiviner = await MemoryBoundWitnessDiviner.create({
      account: 'random',
      config: {
        archivist: discountsArchivist.address,
        schema: MemoryBoundWitnessDiviner.defaultConfigSchema,
      },
    })
    const discountDiviner = await PaymentDiscountDiviner.create({
      account: 'random',
      config: {
        archivist: discountsArchivist.address,
        boundWitnessDiviner: discountsBoundWitnessDiviner.address,
        couponAuthorities: [signer.address],
        schema: PaymentDiscountDiviner.defaultConfigSchema,
      },
    })
    sut = await PaymentTotalDiviner.create({
      account: 'random',
      config: {
        paymentDiscountDiviner: discountDiviner.address,
        paymentSubtotalDiviner: paymentSubtotalDiviner.address,
        schema: PaymentTotalDiviner.defaultConfigSchema,
      },
    })

    const modules = [paymentSubtotalDiviner, discountsArchivist, discountsBoundWitnessDiviner, discountDiviner, sut]
    for (const mod of modules) {
      await node.register(mod)
      await node.attach(mod.address, true)
    }
  })
  describe('with valid escrow', () => {
    describe('with no discounts', () => {
      it.each(cases)('calculates total', async (appraisals, total) => {
        const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
        const terms: EscrowTerms = { ...termsBase, appraisals: appraisalHashes }
        const results = await sut.divine([terms, ...appraisals])
        expect(results).toBeArrayOfSize(3)
        const result = results.find(isTotal)
        expect(result).toBeDefined()
        expect(result).toMatchObject({ amount: total, schema: TotalSchema })
      })
    })
    describe('with valid discounts', () => {
      describe.each(cases)('calculates total', (appraisals, total) => {
        it.each(validCoupons)('applying coupon discount to total', async (coupon) => {
          const discounts = await PayloadBuilder.dataHashes([coupon])
          const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
          const terms: EscrowTerms = {
            ...termsBase, appraisals: appraisalHashes, discounts,
          }
          const results = await sut.divine([terms, ...appraisals, coupon])
          expect(results).toBeArrayOfSize(3)
          const result = results.find(isTotal)
          expect(result).toBeDefined()
          expect(result?.amount).toBeLessThan(total)
        })
      })
    })
    describe('with invalid discounts', () => {
      describe.each(cases)('calculates total', (appraisals, total) => {
        it.each(unsignedCoupons)('without applying coupon discount to total', async (coupon) => {
          const discounts = await PayloadBuilder.dataHashes([coupon])
          const appraisalHashes = await PayloadBuilder.dataHashes(appraisals)
          const terms: EscrowTerms = {
            ...termsBase, appraisals: appraisalHashes, discounts,
          }
          const results = await sut.divine([terms, ...appraisals, coupon])
          expect(results).toBeArrayOfSize(3)
          const result = results.find(isTotal)
          expect(result).toBeDefined()
          expect(result).toMatchObject({ amount: total, schema: TotalSchema })
        })
      })
    })
  })
})
