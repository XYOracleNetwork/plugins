import type { Hash } from '@xylabs/sdk-js'
import type { DurationFields } from '@xyo-network/xns-record-payload-plugins'

/**
 * The fields that are common across all coupons
 */
export interface CouponFields extends DurationFields {
  /**
   * The conditions that must be met in order for this coupon to be applied
   */
  conditions?: Hash[]
  /**
   * Whether or not this discount can be stacked with other discounts
   */
  stackable?: boolean
}
