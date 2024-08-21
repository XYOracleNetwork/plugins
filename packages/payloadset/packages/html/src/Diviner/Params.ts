import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { HtmlQuerySelectorDivinerConfig } from './Config.ts'

export type HtmlQuerySelectorDivinerParams<TConfig extends AnyConfigSchema<HtmlQuerySelectorDivinerConfig> = AnyConfigSchema<HtmlQuerySelectorDivinerConfig>> =
  DivinerParams<TConfig>
