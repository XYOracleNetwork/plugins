import { CryptoCardsMovePayload } from './Payload.ts'
import { CryptoCardsMoveSchema } from './Schema.ts'

export const cryptoCardsMovePayloadTemplate = (): Partial<CryptoCardsMovePayload> => ({ schema: CryptoCardsMoveSchema })
