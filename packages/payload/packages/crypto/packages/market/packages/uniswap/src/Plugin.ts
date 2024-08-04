import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { UniswapCryptoMarketPayload } from './Payload.ts'
import { UniswapCryptoMarketSchema } from './Schema.ts'
import { uniswapCryptoMarketPayloadTemplate } from './Template.ts'

export const UniswapCryptoMarketPayloadPlugin = () =>
  createPayloadPlugin<UniswapCryptoMarketPayload>({
    schema: UniswapCryptoMarketSchema,
    template: uniswapCryptoMarketPayloadTemplate,
  })
