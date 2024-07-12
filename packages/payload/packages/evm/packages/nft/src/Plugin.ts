import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftId, NftIdSchema } from './Payload/index.js'
import { nftIdPayloadTemplate } from './Template.js'

export const NftIdPayloadPlugin = () =>
  createPayloadPlugin<NftId>({
    schema: NftIdSchema,
    template: nftIdPayloadTemplate,
  })
