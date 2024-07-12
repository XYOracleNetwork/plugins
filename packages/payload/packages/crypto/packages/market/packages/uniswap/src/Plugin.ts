import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { UniswapCryptoMarketPayload } from './Payload.js'
import { UniswapCryptoMarketSchema } from './Schema.js'
import { uniswapCryptoMarketPayloadTemplate } from './Template.js'

export const UniswapCryptoMarketPayloadPlugin = () =>
  createPayloadPlugin<UniswapCryptoMarketPayload>({
    schema: UniswapCryptoMarketSchema,
    template: uniswapCryptoMarketPayloadTemplate,
  })
