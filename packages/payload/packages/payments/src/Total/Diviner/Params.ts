import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { PaymentTotalDivinerConfig } from './Config.ts'

export type PaymentTotalDivinerParams<
  TConfig extends AnyConfigSchema<PaymentTotalDivinerConfig> = AnyConfigSchema<PaymentTotalDivinerConfig>,
> = DivinerParams<TConfig>
