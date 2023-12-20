import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NftId } from './Payload'
import { NftIdSchema } from './Schema'
import { addressPayloadTemplate } from './Template'

export const NftIdPayloadPlugin = () =>
  createPayloadPlugin<NftId>({
    schema: NftIdSchema,
    template: addressPayloadTemplate,
  })
