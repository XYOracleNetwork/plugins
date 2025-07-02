import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'

import type { XmlParsingDivinerConfig } from './Config.ts'

export type XmlParsingDivinerParams<TConfig extends AnyConfigSchema<XmlParsingDivinerConfig> = AnyConfigSchema<XmlParsingDivinerConfig>>
  = DivinerParams<TConfig>
