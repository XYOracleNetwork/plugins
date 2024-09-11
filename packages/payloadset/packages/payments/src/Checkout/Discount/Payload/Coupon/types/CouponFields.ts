import type { DurationFields } from '@xyo-network/xns-record-payload-plugins'

/**
 * The fields that are common across all coupons
 */
export interface CouponFields extends DurationFields {
  /**
   * Whether or not this discount can be stacked with other discounts
   */
  stackable?: boolean
}
