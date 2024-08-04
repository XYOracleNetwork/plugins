import { DivinerConfig } from '@xyo-network/diviner-model'

import { XmlParsingDivinerConfigSchema } from './Schema.ts'

export type XmlParsingDivinerConfig = DivinerConfig<
  {
    //
  },
  XmlParsingDivinerConfigSchema
>
