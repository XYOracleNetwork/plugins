import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoCardsGamePayload } from './Payload.js'
import { CryptoCardsGameSchema } from './Schema.js'
import { cryptoCardsGamePayloadTemplate } from './Template.js'

export const CryptoCardsGamePayloadPlugin = () =>
  createPayloadPlugin<CryptoCardsGamePayload>({
    schema: CryptoCardsGameSchema,
    template: cryptoCardsGamePayloadTemplate,
  })
