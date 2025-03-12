import type { Address } from '@xylabs/hex'
import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'

import type { PaymentDiscountDivinerConfig } from './Config.ts'

export type PaymentDiscountDivinerParams<
  TConfig extends AnyConfigSchema<PaymentDiscountDivinerConfig> = AnyConfigSchema<PaymentDiscountDivinerConfig>,
> = DivinerParams<TConfig, {
  /**
     * The list of coupon authorities that can be used to get a discount
     */
  couponAuthorities?: Address[]
}>
