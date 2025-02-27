import { Address } from '@xylabs/hex'
import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { PaymentDiscountDivinerConfig } from './Config.ts'

export type PaymentDiscountDivinerParams<
  TConfig extends AnyConfigSchema<PaymentDiscountDivinerConfig> = AnyConfigSchema<PaymentDiscountDivinerConfig>,
> = DivinerParams<TConfig, {
  /**
     * The list of coupon authorities that can be used to get a discount
     */
  couponAuthorities?: Address[]
}>
