import { asAddress } from '@xylabs/hex'
import type { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

const name = 'EscrowTerms.buyer'

/**
 * A function that validates the escrow terms for buyer
 * @returns True if the escrow terms contain buyer, false otherwise
 */
export const buyerExistsValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have buyer
  const buyer = terms.buyer
  if (!buyer || buyer.length === 0) {
    console.log(`${name}: No buyer: ${terms.buyer}`)
    return false
  }
  // Validate the authorities are addresses
  if (buyer.map(x => asAddress(x)).length !== buyer.length) {
    console.log(`${name}: Invalid address: ${terms.buyer}`)
    return false
  }
  return true
}
