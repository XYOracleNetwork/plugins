import type { CouponFields } from './CouponFields.ts'

/**
 * Identity function for determining if coupon is stackable
 */
export const isStackable = (x?: unknown | null) => (x as CouponFields ?? { stackable: false })?.stackable
