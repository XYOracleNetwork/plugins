import { Crypto } from '@xylabs/crypto'
import type { Id } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'

/**
 * Returns a cryptographically random secret to use for escrow
 * @returns The escrow secret
 */
export const getEscrowSecret = (): Id => {
  return { salt: Crypto.randomUUID(), schema: IdSchema }
}
