import { AsObjectFactory } from '@xylabs/object'

import type {
  FixedAmountCoupon, FixedPercentageCoupon, FixedPriceCoupon,
} from './Coupons/index.ts'
import {
  isFixedAmountCoupon, isFixedAmountCouponWithSources, isFixedPercentageCoupon,
  isFixedPercentageCouponWithSources,
  isFixedPriceCoupon,
  isFixedPriceCouponWithSources,
} from './Coupons/index.ts'

/**
 * The type of coupons
 */
export type Coupon
  = FixedAmountCoupon
    | FixedPercentageCoupon
    | FixedPriceCoupon

/**
 * Identity function for determining if an object is an Coupon
 */
export const isCoupon = (x?: unknown | null) =>
  isFixedAmountCoupon(x)
  || isFixedPercentageCoupon(x)
  || isFixedPriceCoupon(x)
export const asCoupon = AsObjectFactory.create(isCoupon)

/**
 * Identity function for determining if an object is an Coupon with sources
 */
export const isCouponWithSources = (x?: unknown | null) =>
  isFixedAmountCouponWithSources(x)
  || isFixedPercentageCouponWithSources(x)
  || isFixedPriceCouponWithSources(x)
export const asCouponWithSources = AsObjectFactory.create(isCouponWithSources)
