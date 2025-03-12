import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { NftInfo } from './Payload/index.ts'
import { NftSchema } from './Schema.ts'
import { cryptoWalletNftPayloadTemplate } from './Template.ts'

export const NftInfoPayloadPlugin = () =>
  createPayloadPlugin<NftInfo>({
    schema: NftSchema,
    template: cryptoWalletNftPayloadTemplate,
  })
