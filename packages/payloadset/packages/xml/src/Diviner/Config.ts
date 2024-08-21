import type { DivinerConfig } from '@xyo-network/diviner-model'

import type { XmlParsingDivinerConfigSchema } from './Schema.ts'

export type XmlParsingDivinerConfig = DivinerConfig<
  {
    //
  },
  XmlParsingDivinerConfigSchema
>
