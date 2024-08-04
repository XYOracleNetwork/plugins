import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftId, NftIdSchema } from './Payload/index.ts'
import { nftIdPayloadTemplate } from './Template.ts'

export const NftIdPayloadPlugin = () =>
  createPayloadPlugin<NftId>({
    schema: NftIdSchema,
    template: nftIdPayloadTemplate,
  })
