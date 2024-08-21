import { Crypto } from '@xylabs/crypto'
import type { IdPayload } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'

/**
 * Returns a cryptographically random secret to use for escrow
 * @returns The escrow secret
 */
export const getEscrowSecret = (): IdPayload => {
  return { salt: Crypto.randomUUID(), schema: IdSchema }
}
