import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'

import type { PaymentSubtotalDivinerConfig } from './Config.ts'

export type PaymentSubtotalDivinerParams<
  TConfig extends AnyConfigSchema<PaymentSubtotalDivinerConfig> = AnyConfigSchema<PaymentSubtotalDivinerConfig>,
> = DivinerParams<TConfig>
