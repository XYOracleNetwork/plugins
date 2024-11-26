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
  DiscountSchema, EscrowTermsSchema, FixedAmountCouponSchema, FixedPercentageCouponSchema,
  isDiscount,
  PaymentDiscountDivinerConfigSchema,
} from '@xyo-network/payment-payload-plugins'
import {
  beforeAll, beforeEach, describe, expect, it, vi,
} from 'vitest'

import { PaymentDiscountDiviner } from '../Diviner.ts'

describe('PaymentDiscountDiviner', () => {
  let sut: PaymentDiscountDiviner
  const nbf = Date.now()
  const exp = Number.MAX_SAFE_INTEGER
  const termsBase: EscrowTerms = {
    schema: EscrowTermsSchema, appraisals: [], exp, nbf,
  }
  const HUNDRED_DOLLAR_ESTIMATE: HashLeaseEstimate = {
    price: 100, currency: 'USD', exp, nbf, schema: HashLeaseEstimateSchema,
  }
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
  beforeAll(async () => {
    termsBase.appraisals?.push(await PayloadBuilder.hash(HUNDRED_DOLLAR_ESTIMATE))
    const node = await MemoryNode.create({ account: 'random' })
    const archivist = await MemoryArchivist.create({ account: 'random' })
    const signer = await HDWallet.random()
    // Sign the valid coupons and insert them into the archivist
    for (const coupon of validCoupons) {
      const [bw, payloads] = await new BoundWitnessBuilder().signer(signer).payload(coupon).build()
      await archivist.insert([bw, ...payloads])
    }
    // Insert (but do not sign) the unsigned coupons into the archivist
    await archivist.insert(unsignedCoupons)
    const boundWitnessDiviner = await MemoryBoundWitnessDiviner.create({
      account: 'random',
      config: {
        archivist: archivist.address,
        schema: MemoryBoundWitnessDiviner.defaultConfigSchema,
      },
    })
    sut = await PaymentDiscountDiviner.create({
      account: 'random',
      config: {
        archivist: archivist.address,
        boundWitnessDiviner: boundWitnessDiviner.address,
        couponAuthorities: [signer.address],
        schema: PaymentDiscountDivinerConfigSchema,
      },
    })
    const modules = [archivist, boundWitnessDiviner, sut]
    for (const mod of modules) {
      await node.register(mod)
      await node.attach(mod.address, false)
    }
  })
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('with valid coupon', () => {
    it.each(validCoupons)('Applies coupon', async (coupon) => {
      const terms = { ...termsBase, discounts: [await PayloadBuilder.dataHash(coupon)] }
      const results = await sut.divine([terms, HUNDRED_DOLLAR_ESTIMATE, coupon])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isDiscount)
      expect(result).toBeDefined()
      expect(result).toMatchObject({ amount: 10, schema: DiscountSchema })
    })
  })
  describe('with invalid coupon', () => {
    it.each(unsignedCoupons)('Does not apply coupons', async (coupon) => {
      const terms = { ...termsBase, discounts: [await PayloadBuilder.dataHash(coupon)] }
      const results = await sut.divine([terms, HUNDRED_DOLLAR_ESTIMATE, coupon])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isDiscount)
      expect(result).toBeDefined()
      expect(result).toMatchObject({ amount: 0, schema: DiscountSchema })
    })
  })
  describe('with expired coupon', () => {
    const now = Date.now()
    const expiredCoupons: Coupon[] = [
      // In past
      {
        amount: 10, exp: now, nbf: 0, schema: FixedAmountCouponSchema, currency: 'USD',
      },
      // In future
      {
        percentage: 0.1, exp: now + 100_000_000, nbf: now + 10_000_000, schema: FixedPercentageCouponSchema,
      },
    ]
    it.each(expiredCoupons)('Does not apply coupons', async (coupon) => {
      const terms = { ...termsBase, discounts: [await PayloadBuilder.dataHash(coupon)] }
      const results = await sut.divine([terms, HUNDRED_DOLLAR_ESTIMATE, coupon])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isDiscount)
      expect(result).toBeDefined()
      expect(result).toMatchObject({ amount: 0, schema: DiscountSchema })
    })
  })
})
