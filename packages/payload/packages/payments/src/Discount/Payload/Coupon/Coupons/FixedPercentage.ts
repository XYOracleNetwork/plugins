import { AsObjectFactory } from '@xylabs/object'
import type { Payload, PayloadWithOptionalSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { CouponSchema } from '../Schema.ts'
import type { CouponFields } from '../types/index.ts'

export const FixedPercentageCouponSchema = `${CouponSchema}.fixed.percentage` as const
export type FixedPercentageCouponSchema = typeof FixedPercentageCouponSchema

export interface FixedPercentageCouponFields extends CouponFields {
  percentage: number
}

/**
 * A coupon that provides a fixed discount amount
 */
export type FixedPercentageCoupon = PayloadWithOptionalSources<Payload<FixedPercentageCouponFields, FixedPercentageCouponSchema>>

/**
 * Identity function for determining if an object is an FixedPercentageCoupon
 */
export const isFixedPercentageCoupon = isPayloadOfSchemaType<FixedPercentageCoupon>(FixedPercentageCouponSchema)
export const asFixedPercentageCoupon = AsObjectFactory.create(isFixedPercentageCoupon)

/**
 * Identity function for determining if an object is an FixedPercentageCoupon with sources
*/
export const isFixedPercentageCouponWithSources = isPayloadOfSchemaTypeWithSources<FixedPercentageCoupon>(FixedPercentageCouponSchema)
export const asFixedPercentageCouponWithSources = AsObjectFactory.create(isFixedPercentageCouponWithSources)
