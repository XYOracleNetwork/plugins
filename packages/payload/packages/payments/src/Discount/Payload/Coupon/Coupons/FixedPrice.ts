import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../../../Amount/index.ts'
import { CouponSchema } from '../Schema.ts'
import type { CouponFields } from '../types/index.ts'

export const FixedPriceCouponSchema = `${CouponSchema}.fixed.price` as const
export type FixedPriceCouponSchema = typeof FixedPriceCouponSchema

export interface FixedPriceCouponFields extends CouponFields, AmountFields { }

/**
 * A coupon that provides a fixed total price
 */
export type FixedPriceCoupon = PayloadWithSources<FixedPriceCouponFields, FixedPriceCouponSchema>

/**
 * Identity function for determining if an object is an FixedPriceCoupon
 */
export const isFixedPriceCoupon = isPayloadOfSchemaType<FixedPriceCoupon>(FixedPriceCouponSchema)

/**
 * Identity function for determining if an object is an FixedPriceCoupon with sources
 */
export const isFixedPriceCouponWithSources = isPayloadOfSchemaTypeWithSources<FixedPriceCoupon>(FixedPriceCouponSchema)

/**
 * Identity function for determining if an object is an FixedPriceCoupon with meta
 */
export const isFixedPriceCouponWithMeta = isPayloadOfSchemaTypeWithMeta<FixedPriceCoupon>(FixedPriceCouponSchema)
