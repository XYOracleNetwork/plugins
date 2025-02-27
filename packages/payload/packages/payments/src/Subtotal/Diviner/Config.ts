// import type { Hash } from '@xylabs/hex'
import { DivinerConfig } from '@xyo-network/diviner-model'

export const PaymentSubtotalDivinerConfigSchema = 'network.xyo.diviner.payments.subtotal.config'
export type PaymentSubtotalDivinerConfigSchema = typeof PaymentSubtotalDivinerConfigSchema

/**
 * The configuration for the Coupon Subtotal Diviner
 */
export type PaymentSubtotalDivinerConfig = DivinerConfig<
  {},
  PaymentSubtotalDivinerConfigSchema
>
