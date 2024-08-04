import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoCardsGamePayload } from './Payload.ts'
import { CryptoCardsGameSchema } from './Schema.ts'
import { cryptoCardsGamePayloadTemplate } from './Template.ts'

export const CryptoCardsGamePayloadPlugin = () =>
  createPayloadPlugin<CryptoCardsGamePayload>({
    schema: CryptoCardsGameSchema,
    template: cryptoCardsGamePayloadTemplate,
  })
