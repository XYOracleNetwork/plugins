// import type { Hash } from '@xylabs/sdk-js'
import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

export const PaymentSubtotalDivinerConfigSchema = asSchema('network.xyo.diviner.payments.subtotal.config', true)
export type PaymentSubtotalDivinerConfigSchema = typeof PaymentSubtotalDivinerConfigSchema

/**
 * The configuration for the Coupon Subtotal Diviner
 */
export type PaymentSubtotalDivinerConfig = DivinerConfig<
  {},
  PaymentSubtotalDivinerConfigSchema
>
