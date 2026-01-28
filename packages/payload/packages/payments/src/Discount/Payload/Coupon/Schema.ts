import { asSchema } from '@xyo-network/payload-model'

export const CouponSchema = asSchema('network.xyo.payments.coupon', true)
export type CouponSchema = typeof CouponSchema
