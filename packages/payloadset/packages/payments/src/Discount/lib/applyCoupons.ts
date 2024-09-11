import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'

import type { AmountFields } from '../../Amount/index.ts'
import type {
  Coupon, Discount, FixedAmountCoupon,
  FixedPercentageCoupon,
} from '../Payload/index.ts'
import {
  DiscountSchema, isFixedAmountCoupon, isFixedPercentageCoupon,
  isStackable,
} from '../Payload/index.ts'

export const applyCoupons = (appraisals: HashLeaseEstimate[], coupons: Coupon[]): Discount => {
  // Ensure all appraisals and coupons are in USD
  const allAppraisalsAreUSD = appraisals.every(appraisal => appraisal.currency === 'USD')
  assertEx(allAppraisalsAreUSD, 'All appraisals must be in USD')
  const allCouponsAreUSD = coupons.map(coupon => (coupon as Partial<AmountFields>)?.currency).filter(exists).every(currency => currency === 'USD')
  assertEx(allCouponsAreUSD, 'All coupons must be in USD')
  const total = appraisals.reduce((acc, appraisal) => acc + appraisal.price, 0)

  // Calculated non-stackable discount coupons
  const singularFixedDiscount = Math.max(...coupons
    .filter(coupon => isFixedAmountCoupon(coupon) && !isStackable(coupon))
    .map(coupon => (coupon as FixedAmountCoupon).amount), 0)
  const singularPercentageDiscount = (Math.max(...coupons
    .filter(coupon => isFixedPercentageCoupon(coupon) && !isStackable(coupon))
    .map(coupon => (coupon as FixedPercentageCoupon).percentage), 0)) * total

  // Calculate stackable discount coupons
  // First calculate the total discount from fixed amount coupons
  const stackedFixedDiscount = coupons
    .filter(coupon => isFixedAmountCoupon(coupon) && isStackable(coupon))
    .reduce((acc, coupon) => acc + (coupon as FixedAmountCoupon).amount, 0)
  // Then calculate the total discount from percentage coupons and apply
  // the percentage discount to the remaining total after fixed discounts
  const stackedPercentageDiscount = coupons
    .filter(coupon => isFixedPercentageCoupon(coupon) && isStackable(coupon))
    .reduce((acc, coupon) => acc + (coupon as FixedPercentageCoupon).percentage, 0) * (total - stackedFixedDiscount)
  // Sum all stackable discounts
  const stackedDiscount = stackedFixedDiscount + stackedPercentageDiscount

  // Find the best coupon(s) to apply
  const maxDiscount = Math.max(
    singularFixedDiscount,
    singularPercentageDiscount,
    stackedDiscount,
    0,
  )

  // Ensure discount is not more than the total
  const amount = Math.min(maxDiscount, total)

  // Return single discount payload
  return {
    amount, schema: DiscountSchema, currency: 'USD',
  }
}
