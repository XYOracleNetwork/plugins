import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
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
export type FixedPercentageCoupon = PayloadWithSources<FixedPercentageCouponFields, FixedPercentageCouponSchema>

/**
 * Identity function for determining if an object is an FixedPercentageCoupon
 */
export const isFixedPercentageCoupon = isPayloadOfSchemaType<FixedPercentageCoupon>(FixedPercentageCouponSchema)

/**
 * Identity function for determining if an object is an FixedPercentageCoupon with sources
 */
export const isFixedPercentageCouponWithSources = isPayloadOfSchemaTypeWithSources<FixedPercentageCoupon>(FixedPercentageCouponSchema)

/**
 * Identity function for determining if an object is an FixedPercentageCoupon with meta
 */
export const isFixedPercentageCouponWithMeta = isPayloadOfSchemaTypeWithMeta<FixedPercentageCoupon>(FixedPercentageCouponSchema)
