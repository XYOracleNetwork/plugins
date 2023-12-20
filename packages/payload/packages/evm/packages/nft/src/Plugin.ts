import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftId, NftIdSchema } from './Payload'
import { nftIdPayloadTemplate } from './Template'

export const NftIdPayloadPlugin = () =>
  createPayloadPlugin<NftId>({
    schema: NftIdSchema,
    template: nftIdPayloadTemplate,
  })
