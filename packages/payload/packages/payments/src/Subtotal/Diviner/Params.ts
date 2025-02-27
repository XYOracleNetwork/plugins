import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { PaymentSubtotalDivinerConfig } from './Config.ts'

export type PaymentSubtotalDivinerParams<
  TConfig extends AnyConfigSchema<PaymentSubtotalDivinerConfig> = AnyConfigSchema<PaymentSubtotalDivinerConfig>,
> = DivinerParams<TConfig>
