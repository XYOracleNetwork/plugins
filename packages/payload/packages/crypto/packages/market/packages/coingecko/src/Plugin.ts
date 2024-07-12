import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CoingeckoCryptoMarketPayload } from './Payload.js'
import { CoingeckoCryptoMarketSchema } from './Schema.js'
import { coingeckoCryptoMarketPayloadTemplate } from './Template.js'

export const CoingeckoCryptoMarketPayloadPlugin = () =>
  createPayloadPlugin<CoingeckoCryptoMarketPayload>({
    schema: CoingeckoCryptoMarketSchema,
    template: coingeckoCryptoMarketPayloadTemplate,
  })
