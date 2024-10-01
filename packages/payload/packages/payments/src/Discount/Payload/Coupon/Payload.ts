import {
  type FixedAmountCoupon, type FixedPercentageCoupon, type FixedPriceCoupon,
  isFixedAmountCoupon, isFixedAmountCouponWithMeta, isFixedAmountCouponWithSources, isFixedPercentageCoupon,
  isFixedPercentageCouponWithMeta,
  isFixedPercentageCouponWithSources,
  isFixedPriceCoupon,
  isFixedPriceCouponWithMeta,
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

/**
 * Identity function for determining if an object is an Coupon with meta
 */
export const isCouponWithMeta = (x?: unknown | null) =>
  isFixedAmountCouponWithMeta(x)
  || isFixedPercentageCouponWithMeta(x)
  || isFixedPriceCouponWithMeta(x)
