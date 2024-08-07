import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { XmlParsingDivinerConfig } from './Config.ts'

export type XmlParsingDivinerParams<TConfig extends AnyConfigSchema<XmlParsingDivinerConfig> = AnyConfigSchema<XmlParsingDivinerConfig>> =
  DivinerParams<TConfig>
