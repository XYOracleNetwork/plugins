import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import type { Coupon } from '@xyo-network/payment-payload-plugins'
import {
  DiscountSchema, FixedAmountCouponSchema, FixedPercentageCouponSchema,
  FixedPriceCouponSchema,
} from '@xyo-network/payment-payload-plugins'
import {
  beforeEach, describe, it, vi,
} from 'vitest'

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
  const TEN_DOLLAR_ITEM_COUPON: Coupon = {
    amount: 10, exp, nbf, schema: FixedPriceCouponSchema, currency: 'USD',
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
    const validCoupons: [estimates: HashLeaseEstimate[], coupons: Coupon[], discount: number][] = [
      // $100 item with $10 off coupon = $90 total/$10 discount
      [[HUNDRED_DOLLAR_ESTIMATE], [TEN_DOLLAR_OFF_COUPON], 10],
      // Two items (totalling $100) with $10 off coupon = $90 total/$10 discount
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_DOLLAR_OFF_COUPON], 10],
      // $100 item with 10% off coupon = $90 total/$10 discount
      [[HUNDRED_DOLLAR_ESTIMATE], [TEN_PERCENT_OFF_COUPON], 10],
      // Two items (totalling $100) with 10% off coupon = $90 total/$10 discount
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_PERCENT_OFF_COUPON], 10],
      // Two items (totalling $100) with 10% off coupon = $90 total/$10 discount
      [[THIRTY_DOLLAR_ESTIMATE, SEVENTY_DOLLAR_ESTIMATE], [TEN_PERCENT_OFF_COUPON], 10],
      // $100 item with $10 per item coupon = $10 total/$90 discount
      [[HUNDRED_DOLLAR_ESTIMATE], [TEN_DOLLAR_ITEM_COUPON], 90],
      // Two items (totalling $100) with $10 per item coupon = $20 total/$80 discount
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_DOLLAR_ITEM_COUPON], 80],
      // Four items (totalling $200) with $10 per item coupon = $40 total/$160 discount
      [[SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE, SEVENTY_DOLLAR_ESTIMATE, THIRTY_DOLLAR_ESTIMATE], [TEN_DOLLAR_ITEM_COUPON], 160],
    ]
    it.each(validCoupons)('Applies coupon discount', (estimates, coupons, amount) => {
      const results = applyCoupons(estimates, coupons)
      expect(results).toEqual({
        amount, schema: DiscountSchema, currency: 'USD',
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
