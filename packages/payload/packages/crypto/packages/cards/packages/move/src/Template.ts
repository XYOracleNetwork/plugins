import { CryptoCardsMovePayload } from './Payload.js'
import { CryptoCardsMoveSchema } from './Schema.js'

export const cryptoCardsMovePayloadTemplate = (): Partial<CryptoCardsMovePayload> => ({
  schema: CryptoCardsMoveSchema,
})
