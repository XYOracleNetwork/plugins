import type { Payload } from '@xyo-network/payload-model'

import type { CryptoCardsMoveSchema } from './Schema.ts'

export type CryptoCardsMovePayload = Payload<{
  /** @field The Huri of each of the cards you play - some are globally available */
  cards: string[]
  /** @field The moves chosen by the player (negative/positive for direction, and weight) */
  moves: number[]
  schema: CryptoCardsMoveSchema
}>
