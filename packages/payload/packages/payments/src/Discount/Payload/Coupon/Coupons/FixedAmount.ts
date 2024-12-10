import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../../../Amount/index.ts'
import { CouponSchema } from '../Schema.ts'
import type { CouponFields } from '../types/index.ts'

export const FixedAmountCouponSchema = `${CouponSchema}.fixed.amount` as const
export type FixedAmountCouponSchema = typeof FixedAmountCouponSchema

export interface FixedAmountCouponFields extends CouponFields, AmountFields {}

/**
 * A coupon that provides a fixed discount amount
 */
export type FixedAmountCoupon = PayloadWithSources<FixedAmountCouponFields, FixedAmountCouponSchema>

/**
 * Identity function for determining if an object is an FixedAmountCoupon
 */
export const isFixedAmountCoupon = isPayloadOfSchemaType<FixedAmountCoupon>(FixedAmountCouponSchema)

/**
 * Identity function for determining if an object is an FixedAmountCoupon with sources
 */
export const isFixedAmountCouponWithSources = isPayloadOfSchemaTypeWithSources<FixedAmountCoupon>(FixedAmountCouponSchema)
