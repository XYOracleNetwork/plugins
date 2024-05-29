import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { TZeroStockMarketPayload } from './Payload'
import { TZeroStockMarketSchema as TZeroStockMarketSchema } from './Schema'
import { tZeroStockMarketPayloadTemplate } from './Template'

export const TZeroStockMarketPayloadPlugin = () =>
  createPayloadPlugin<TZeroStockMarketPayload>({
    schema: TZeroStockMarketSchema,
    template: tZeroStockMarketPayloadTemplate,
  })
