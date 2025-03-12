import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { CoingeckoCryptoMarketPayload } from './Payload.ts'
import { CoingeckoCryptoMarketSchema } from './Schema.ts'
import { coingeckoCryptoMarketPayloadTemplate } from './Template.ts'

export const CoingeckoCryptoMarketPayloadPlugin = () =>
  createPayloadPlugin<CoingeckoCryptoMarketPayload>({
    schema: CoingeckoCryptoMarketSchema,
    template: coingeckoCryptoMarketPayloadTemplate,
  })
