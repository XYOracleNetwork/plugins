import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  asSchema,
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../../../Amount/index.ts'
import { CouponSchema } from '../Schema.ts'
import type { CouponFields } from '../types/index.ts'

export const FixedAmountCouponSchema = asSchema(`${CouponSchema}.fixed.amount`, true)
export type FixedAmountCouponSchema = typeof FixedAmountCouponSchema

export interface FixedAmountCouponFields extends CouponFields, AmountFields {}

/**
 * A coupon that provides a fixed discount amount
 */
export type FixedAmountCoupon = Payload<FixedAmountCouponFields, FixedAmountCouponSchema>

/**
 * Identity function for determining if an object is an FixedAmountCoupon
 */
export const isFixedAmountCoupon = isPayloadOfSchemaType<FixedAmountCoupon>(FixedAmountCouponSchema)
export const asFixedAmountCoupon = AsObjectFactory.create<FixedAmountCoupon>(isFixedAmountCoupon)
export const asOptionalFixedAmountCoupon = AsObjectFactory.createOptional<FixedAmountCoupon>(isFixedAmountCoupon)

/**
 * Identity function for determining if an object is an FixedAmountCoupon with sources
*/
export const isFixedAmountCouponWithSources = isPayloadOfSchemaTypeWithSources<WithSources<FixedAmountCoupon>>(FixedAmountCouponSchema)
export const asFixedAmountCouponWithSources = AsObjectFactory.create<WithSources<FixedAmountCoupon>>(isFixedAmountCouponWithSources)
export const asOptionalFixedAmountCouponWithSources = AsObjectFactory.createOptional<WithSources<FixedAmountCoupon>>(isFixedAmountCouponWithSources)
