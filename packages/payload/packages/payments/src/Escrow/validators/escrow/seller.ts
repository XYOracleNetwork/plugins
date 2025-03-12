import { asAddress } from '@xylabs/hex'
import type { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

const name = 'EscrowTerms.seller'

/**
 * A function that validates the escrow terms for seller
 * @returns True if the escrow terms contain seller, false otherwise
 */
export const sellerExistsValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have seller
  const seller = terms.seller
  if (!seller || seller.length === 0) {
    console.log(`${name}: No seller: ${terms.seller}`)
    return false
  }
  // Validate the authorities are addresses
  if (seller.map(x => asAddress(x)).length !== seller.length) {
    console.log(`${name}: Invalid address: ${terms.seller}`)
    return false
  }
  return true
}
