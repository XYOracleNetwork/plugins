import {
  type FixedAmountCoupon, type FixedPercentageCoupon, isFixedAmountCoupon, isFixedAmountCouponWithMeta, isFixedAmountCouponWithSources, isFixedPercentageCoupon,
  isFixedPercentageCouponWithMeta,
  isFixedPercentageCouponWithSources,
} from './Coupons/index.ts'

/**
 * The result of a discount
 */
export type Coupon = FixedAmountCoupon | FixedPercentageCoupon

/**
 * Identity function for determining if an object is an Coupon
 */
export const isCoupon = (x?: unknown | null) => isFixedAmountCoupon(x) || isFixedPercentageCoupon(x)

/**
 * Identity function for determining if an object is an Coupon with sources
 */
export const isCouponWithSources = (x?: unknown | null) => isFixedAmountCouponWithSources(x) || isFixedPercentageCouponWithSources(x)

/**
 * Identity function for determining if an object is an Coupon with meta
 */
export const isCouponWithMeta = (x?: unknown | null) => isFixedAmountCouponWithMeta(x) || isFixedPercentageCouponWithMeta(x)
