import type { Address } from '@xylabs/sdk-js'
import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'

import type { PaymentDiscountDivinerConfig } from './Config.ts'

export interface PaymentDiscountDivinerParams<
  TConfig extends AnyConfigSchema<PaymentDiscountDivinerConfig> = AnyConfigSchema<PaymentDiscountDivinerConfig>,
> extends DivinerParams<TConfig> {
  /**
     * The list of coupon authorities that can be used to get a discount
     */
  couponAuthorities?: Address[]
}
