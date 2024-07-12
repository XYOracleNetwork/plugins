import { CryptoCardsGamePayload } from './Payload.js'
import { CryptoCardsGameSchema } from './Schema.js'

export const cryptoCardsGamePayloadTemplate = (): Partial<CryptoCardsGamePayload> => ({
  schema: CryptoCardsGameSchema,
})
