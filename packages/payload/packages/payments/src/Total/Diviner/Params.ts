import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'

import type { PaymentTotalDivinerConfig } from './Config.ts'

export type PaymentTotalDivinerParams<
  TConfig extends AnyConfigSchema<PaymentTotalDivinerConfig> = AnyConfigSchema<PaymentTotalDivinerConfig>,
> = DivinerParams<TConfig>
