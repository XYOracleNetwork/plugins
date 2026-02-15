// import type { Hash } from '@xylabs/sdk-js'
import type { Address } from '@xylabs/sdk-js'
import type { DivinerConfig } from '@xyo-network/diviner-model'
import type { ModuleIdentifier } from '@xyo-network/module-model'
import { asSchema } from '@xyo-network/payload-model'

export const PaymentDiscountDivinerConfigSchema = asSchema('network.xyo.diviner.payments.discount.config', true)
export type PaymentDiscountDivinerConfigSchema = typeof PaymentDiscountDivinerConfigSchema

/**
 * The configuration for the Payment Discount Diviner
 */
export type PaymentDiscountDivinerConfig = DivinerConfig<
  {
    /**
     * The boundwitness diviner used to query for payloads
     */
    boundWitnessDiviner?: ModuleIdentifier
    /**
     * The list of coupon authorities that can be used to get a discount
     */
    couponAuthorities?: Address[]

    // /**
    //  * The list of coupons that are supported by this diviner
    //  */
    // supportedCoupons?: Hash[]

    /**
     * The Diviner that can be used to determine the subtotal to apply discounts to
     */
    paymentSubtotalDiviner?: ModuleIdentifier
  },
  PaymentDiscountDivinerConfigSchema
>
