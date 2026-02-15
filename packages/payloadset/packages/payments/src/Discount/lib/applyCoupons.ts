import { assertEx, exists } from '@xylabs/sdk-js'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import type {
  AmountFields,
  Coupon, Discount, FixedAmountCoupon,
  FixedPercentageCoupon,
  FixedPriceCoupon,
} from '@xyo-network/payment-payload-plugins'
import {
  DiscountSchema,
  isFixedAmountCoupon, isFixedPercentageCoupon,
  isFixedPriceCoupon,
  isStackable,
} from '@xyo-network/payment-payload-plugins'

export const applyCoupons = (appraisals: HashLeaseEstimate[], coupons: Coupon[]): Discount => {
  // Ensure all appraisals and coupons are in USD
  const allAppraisalsAreUSD = appraisals.every(appraisal => appraisal.currency === 'USD')
  assertEx(allAppraisalsAreUSD, () => 'All appraisals must be in USD')
  const allCouponsAreUSD = coupons.map(coupon => (coupon as Partial<AmountFields>)?.currency).filter(exists).every(currency => currency === 'USD')
  assertEx(allCouponsAreUSD, () => 'All coupons must be in USD')
  const total = appraisals.reduce((acc, appraisal) => acc + appraisal.price, 0)

  // Calculated non-stackable discount coupons
  const singularFixedDiscount = Math.max(...coupons
    .filter(coupon => isFixedAmountCoupon(coupon) && !isStackable(coupon))
    .map(coupon => (coupon as FixedAmountCoupon).amount), 0)
  const singularPercentageDiscount = (Math.max(...coupons
    .filter(coupon => isFixedPercentageCoupon(coupon) && !isStackable(coupon))
    .map(coupon => (coupon as FixedPercentageCoupon).percentage), 0)) * total
  const singularFixedPriceDiscount = calculateSingularFixedPriceDiscount(total, appraisals, coupons, false)

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
  // Then calculate the total discount from fixed price coupons
  const stackedFixedPriceDiscount = calculateSingularFixedPriceDiscount(total, appraisals, coupons, true)

  // Sum all stackable discounts
  const stackedDiscount = stackedFixedDiscount + stackedPercentageDiscount + stackedFixedPriceDiscount

  // Find the best coupon(s) to apply
  const maxDiscount = Math.max(
    singularFixedDiscount,
    singularFixedPriceDiscount,
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

const calculateSingularFixedPriceDiscount = (total: number, appraisals: HashLeaseEstimate[], coupons: Coupon[], stackable = false): number => {
  // Find all singular fixed price discounts
  const singularFixedPriceDiscounts = coupons
    .filter(isFixedPriceCoupon)
    .filter(coupon => stackable ? isStackable(coupon) : !isStackable(coupon))
    .map(coupon => (coupon as FixedPriceCoupon).amount)
    // Ensure all fixed price discounts are positive
    .filter(amount => amount > 0)

  // If there are no singular fixed price discounts, return no discount
  if (singularFixedPriceDiscounts.length === 0) return 0

  // Find the maximum discount (the lowest fixed price)
  const lowestFixedPrice = Math.min(...singularFixedPriceDiscounts)

  // Apply the fixed price to all appraisals to get the reduced prices
  const reducedPrices = appraisals.map(appraisal =>
  // If the appraisal price is less than the fixed price
    Math.min(appraisal.price, lowestFixedPrice))

  // Calculate the reduced total using the reduced prices
  const reducedTotal = reducedPrices.reduce((acc, price) => acc + price, 0)

  // Calculate the discount
  const discount = total - reducedTotal

  // Return the discount or 0 if the discount would have resulted in a negative value
  return Math.max(discount, 0)
}
