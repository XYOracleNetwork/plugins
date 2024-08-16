import { DivinerConfig } from '@xyo-network/diviner-model'

import { HtmlQuerySelectorDivinerConfigSchema } from './Schema.ts'

export type HtmlQuerySelectorDivinerConfig = DivinerConfig<
  {
    // TODO: Optional config query selector
  },
  HtmlQuerySelectorDivinerConfigSchema
>
