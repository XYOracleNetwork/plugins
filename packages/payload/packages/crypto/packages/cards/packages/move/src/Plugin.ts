import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { CryptoCardsMovePayload } from './Payload.ts'
import { CryptoCardsMoveSchema } from './Schema.ts'
import { cryptoCardsMovePayloadTemplate } from './Template.ts'

export const CryptoCardsMovePayloadPlugin = () =>
  createPayloadPlugin<CryptoCardsMovePayload>({
    schema: CryptoCardsMoveSchema,
    template: cryptoCardsMovePayloadTemplate,
  })
