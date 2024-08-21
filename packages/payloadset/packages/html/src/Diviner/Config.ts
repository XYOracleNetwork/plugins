import { DivinerConfig } from '@xyo-network/diviner-model'

import { HtmlQuerySelectorDivinerConfigSchema } from './Schema.ts'

export type HtmlQuerySelectorDivinerConfig = DivinerConfig<
  {
    /**
     * A string containing one or more selectors to match.
     */
    querySelector?: string
    /**
     * A string containing one or more selectors to match.
     */
    querySelectorAll?: string
  },
  HtmlQuerySelectorDivinerConfigSchema
>
