import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoMarketAssetPayload } from './Payload.js'
import { CryptoMarketAssetSchema } from './Schema.js'
import { cryptoMarketAssetPayloadTemplate } from './Template.js'

export const CryptoMarketAssetPayloadPlugin = () =>
  createPayloadPlugin<CryptoMarketAssetPayload>({
    schema: CryptoMarketAssetSchema,
    template: cryptoMarketAssetPayloadTemplate,
  })
