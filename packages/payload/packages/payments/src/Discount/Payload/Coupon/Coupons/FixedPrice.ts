import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
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
export type FixedPriceCoupon = Payload<FixedPriceCouponFields, FixedPriceCouponSchema>

/**
 * Identity function for determining if an object is an FixedPriceCoupon
 */
export const isFixedPriceCoupon = isPayloadOfSchemaType<FixedPriceCoupon>(FixedPriceCouponSchema)
export const asFixedPriceCoupon = AsObjectFactory.create<FixedPriceCoupon>(isFixedPriceCoupon)
export const asOptionalFixedPriceCoupon = AsObjectFactory.createOptional<FixedPriceCoupon>(isFixedPriceCoupon)

/**
 * Identity function for determining if an object is an FixedPriceCoupon with sources
*/
export const isFixedPriceCouponWithSources = isPayloadOfSchemaTypeWithSources<WithSources<FixedPriceCoupon>>(FixedPriceCouponSchema)
export const asFixedPriceCouponWithSources = AsObjectFactory.create<WithSources<FixedPriceCoupon>>(isFixedPriceCouponWithSources)
export const asOptionalFixedPriceCouponWithSources = AsObjectFactory.createOptional<WithSources<FixedPriceCoupon>>(isFixedPriceCouponWithSources)
