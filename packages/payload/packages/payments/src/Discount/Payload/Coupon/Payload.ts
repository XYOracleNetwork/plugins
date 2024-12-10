import {
  type FixedAmountCoupon, type FixedPercentageCoupon, type FixedPriceCoupon,
  isFixedAmountCoupon, isFixedAmountCouponWithSources, isFixedPercentageCoupon,
  isFixedPercentageCouponWithSources,
  isFixedPriceCoupon,
  isFixedPriceCouponWithSources,
} from './Coupons/index.ts'

/**
 * The type of coupons
 */
export type Coupon =
  FixedAmountCoupon
  | FixedPercentageCoupon
  | FixedPriceCoupon

/**
 * Identity function for determining if an object is an Coupon
 */
export const isCoupon = (x?: unknown | null) =>
  isFixedAmountCoupon(x)
  || isFixedPercentageCoupon(x)
  || isFixedPriceCoupon(x)

/**
 * Identity function for determining if an object is an Coupon with sources
 */
export const isCouponWithSources = (x?: unknown | null) =>
  isFixedAmountCouponWithSources(x)
  || isFixedPercentageCouponWithSources(x)
  || isFixedPriceCouponWithSources(x)
