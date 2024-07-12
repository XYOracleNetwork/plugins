import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftCollectionInfo } from './Payload/index.js'
import { NftCollectionSchema } from './Schema.js'
import { cryptoNftCollectionPayloadTemplate } from './Template.js'

export const NftCollectionInfoPayloadPlugin = () =>
  createPayloadPlugin<NftCollectionInfo>({
    schema: NftCollectionSchema,
    template: cryptoNftCollectionPayloadTemplate,
  })
