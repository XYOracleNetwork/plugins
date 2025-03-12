import type { CryptoCardsGamePayload } from './Payload.ts'
import { CryptoCardsGameSchema } from './Schema.ts'

export const cryptoCardsGamePayloadTemplate = (): Partial<CryptoCardsGamePayload> => ({ schema: CryptoCardsGameSchema })
