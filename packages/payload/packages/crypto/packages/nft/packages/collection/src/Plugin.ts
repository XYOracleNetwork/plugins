import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { NftCollectionInfo } from './Payload/index.ts'
import { NftCollectionSchema } from './Schema.ts'
import { cryptoNftCollectionPayloadTemplate } from './Template.ts'

export const NftCollectionInfoPayloadPlugin = () =>
  createPayloadPlugin<NftCollectionInfo>({
    schema: NftCollectionSchema,
    template: cryptoNftCollectionPayloadTemplate,
  })
