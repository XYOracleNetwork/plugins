import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { XmlParsingDivinerConfig } from './Config.js'

export type XmlParsingDivinerParams<TConfig extends AnyConfigSchema<XmlParsingDivinerConfig> = AnyConfigSchema<XmlParsingDivinerConfig>> =
  DivinerParams<TConfig>
