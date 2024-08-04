import { asAddress } from '@xylabs/hex'
import { PayloadValidationFunction } from '@xyo-network/payload-model'

import { EscrowTerms } from '../../Terms.ts'

const name = 'EscrowTerms.buyer'

/**
 * A function that validates the escrow terms for buyer
 * @returns True if the escrow terms contain buyer, false otherwise
 */
export const buyerExistsValidator: PayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
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
