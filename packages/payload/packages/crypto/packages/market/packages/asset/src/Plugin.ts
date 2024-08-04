import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoMarketAssetPayload } from './Payload.ts'
import { CryptoMarketAssetSchema } from './Schema.ts'
import { cryptoMarketAssetPayloadTemplate } from './Template.ts'

export const CryptoMarketAssetPayloadPlugin = () =>
  createPayloadPlugin<CryptoMarketAssetPayload>({
    schema: CryptoMarketAssetSchema,
    template: cryptoMarketAssetPayloadTemplate,
  })
