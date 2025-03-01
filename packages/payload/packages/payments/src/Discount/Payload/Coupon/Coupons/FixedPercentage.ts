import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
  Payload, WithSources,
} from '@xyo-network/payload-model'

import { CouponSchema } from '../Schema.ts'
import { CouponFields } from '../types/index.ts'

export const FixedPercentageCouponSchema = `${CouponSchema}.fixed.percentage` as const
export type FixedPercentageCouponSchema = typeof FixedPercentageCouponSchema

export interface FixedPercentageCouponFields extends CouponFields {
  percentage: number
}

/**
 * A coupon that provides a fixed discount amount
 */
export type FixedPercentageCoupon = Payload<FixedPercentageCouponFields, FixedPercentageCouponSchema>

/**
 * Identity function for determining if an object is an FixedPercentageCoupon
 */
export const isFixedPercentageCoupon = isPayloadOfSchemaType<FixedPercentageCoupon>(FixedPercentageCouponSchema)
export const asFixedPercentageCoupon = AsObjectFactory.create<FixedPercentageCoupon>(isFixedPercentageCoupon)
export const asOptionalFixedPercentageCoupon = AsObjectFactory.createOptional<FixedPercentageCoupon>(isFixedPercentageCoupon)

/**
 * Identity function for determining if an object is an FixedPercentageCoupon with sources
*/
export const isFixedPercentageCouponWithSources = isPayloadOfSchemaTypeWithSources<WithSources<FixedPercentageCoupon>>(FixedPercentageCouponSchema)
export const asFixedPercentageCouponWithSources = AsObjectFactory.create<WithSources<FixedPercentageCoupon>>(isFixedPercentageCouponWithSources)
export const asOptionalFixedPercentageCouponWithSources = AsObjectFactory.createOptional<WithSources<FixedPercentageCoupon>>(isFixedPercentageCouponWithSources)
