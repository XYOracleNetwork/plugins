import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoCardsMovePayload } from './Payload.js'
import { CryptoCardsMoveSchema } from './Schema.js'
import { cryptoCardsMovePayloadTemplate } from './Template.js'

export const CryptoCardsMovePayloadPlugin = () =>
  createPayloadPlugin<CryptoCardsMovePayload>({
    schema: CryptoCardsMoveSchema,
    template: cryptoCardsMovePayloadTemplate,
  })
