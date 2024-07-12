import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftInfo } from './Payload/index.js'
import { NftSchema } from './Schema.js'
import { cryptoWalletNftPayloadTemplate } from './Template.js'

export const NftInfoPayloadPlugin = () =>
  createPayloadPlugin<NftInfo>({
    schema: NftSchema,
    template: cryptoWalletNftPayloadTemplate,
  })
