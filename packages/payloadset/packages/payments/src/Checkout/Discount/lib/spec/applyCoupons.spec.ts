import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import {
  beforeEach, describe, it, vi,
} from 'vitest'

import type { Coupon } from '../../Payload/index.ts'
import {
  DiscountSchema, FixedAmountCouponSchema, FixedPercentageCouponSchema,
} from '../../Payload/index.ts'
import { applyCoupons } from '../applyCoupons.ts'

describe('applyCoupons', () => {
  const nbf = Date.now()
  const exp = Date.now() + 10_000_000
  // Coupons
  const TEN_DOLLAR_OFF_COUPON: Coupon = {
    amount: 10, exp, nbf, schema: FixedAmountCouponSchema, currency: 'USD',
  }
  const TEN_PERCENT_OFF_COUPON: Coupon = {
    percentage: 0.1, exp, nbf, schema: FixedPercentageCouponSchema,
  }
  // Appraisals
  const HUNDRED_DOLLAR_ESTIMATE: HashLeaseEstimate = {
    price: 100, currency: 'USD', exp, nbf, schema: HashLeaseEstimateSchema,
  }
  const SEVENTY_DOLLAR_ESTIMATE: HashLeaseEstimate = {
    price: 70, currency: 'USD', exp, nbf, schema: HashLeaseEstimateSchema,
  }
  const THIRTY_DOLLAR_ESTIMATE: HashLeaseEstimate = {
    price: 30, currency: 'USD', exp, nbf, schema: HashLeaseEstimateSchema,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('when coupon is less than total', () => {
    const validCoupons: [HashLeaseEstimate[], Coupon[]][] = [
      [[HUNDRED_DOLLAR_ESTIMATE], [TEN_DOLLAR_OFF_COUPON]],
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_DOLLAR_OFF_COUPON]],
      [[HUNDRED_DOLLAR_ESTIMATE], [TEN_PERCENT_OFF_COUPON]],
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_PERCENT_OFF_COUPON]],
    ]
    it.each(validCoupons)('Applies coupon discount', (estimates, coupons) => {
      const results = applyCoupons(estimates, coupons)
      expect(results).toEqual({
        amount: 10, schema: DiscountSchema, currency: 'USD',
      })
    })
  })
  describe('when discount exceeds total', () => {
    const discountExceedsTotal: [HashLeaseEstimate[], Coupon[]][] = [
      [
        [HUNDRED_DOLLAR_ESTIMATE],
        [{
          amount: 101, exp, nbf, schema: FixedAmountCouponSchema, currency: 'USD',
        }]],
      [
        [HUNDRED_DOLLAR_ESTIMATE],
        [{
          percentage: 1.1, exp, nbf, schema: FixedPercentageCouponSchema,
        }]],
    ]
    it.each(discountExceedsTotal)('Discounts only to total', (estimates, coupons) => {
      const results = applyCoupons(estimates, coupons)
      const amount = estimates.reduce((acc, a) => acc + a.price, 0)
      expect(results).toEqual({
        amount, schema: DiscountSchema, currency: 'USD',
      })
    })
  })
  describe('with stackable discounts', () => {
    const STACKABLE_TEN_DOLLAR_OFF_COUPON: Coupon = { ...TEN_DOLLAR_OFF_COUPON, stackable: true }
    const STACKABLE_TEN_PERCENT_OFF_COUPON: Coupon = { ...TEN_PERCENT_OFF_COUPON, stackable: true }
    const validCoupons: [HashLeaseEstimate[], Coupon[], number][] = [
      [[HUNDRED_DOLLAR_ESTIMATE], [STACKABLE_TEN_DOLLAR_OFF_COUPON, STACKABLE_TEN_PERCENT_OFF_COUPON], 19],
      [[HUNDRED_DOLLAR_ESTIMATE], [STACKABLE_TEN_PERCENT_OFF_COUPON, STACKABLE_TEN_DOLLAR_OFF_COUPON], 19],
    ]
    it.each(validCoupons)('Applies both discounts', (estimates, coupons, amount) => {
      const results = applyCoupons(estimates, coupons)
      expect(results).toEqual({
        amount, schema: DiscountSchema, currency: 'USD',
      })
    })
  })
})
