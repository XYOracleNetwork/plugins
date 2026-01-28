// import type { Hash } from '@xylabs/hex'
import type { DivinerConfig } from '@xyo-network/diviner-model'
import type { ModuleIdentifier } from '@xyo-network/module-model'
import { asSchema } from '@xyo-network/payload-model'

export const PaymentTotalDivinerConfigSchema = asSchema('network.xyo.diviner.payments.total.config', true)
export type PaymentTotalDivinerConfigSchema = typeof PaymentTotalDivinerConfigSchema

/**
 * The configuration for the Total Diviner
 */
export type PaymentTotalDivinerConfig = DivinerConfig<
  {
    /**
     * The Diviner that will be used to determine the discount
     */
    paymentDiscountDiviner?: ModuleIdentifier

    /**
     * The Diviner that will be used to determine the subtotal
     */
    paymentSubtotalDiviner?: ModuleIdentifier
  },
  PaymentTotalDivinerConfigSchema
>
