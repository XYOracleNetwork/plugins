import { asAddress } from '@xylabs/hex'
import { PayloadValidationFunction } from '@xyo-network/payload-model'

import { EscrowTerms } from '../../Terms'

const name = 'EscrowTerms.seller'

/**
 * A function that validates the escrow terms for seller
 * @returns True if the escrow terms contain seller, false otherwise
 */
export const sellerExistsValidator: PayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have seller
  const seller = terms.seller
  if (!seller || seller.length === 0) {
    console.log(`${name}: No seller: ${terms.seller}`)
    return false
  }
  // Validate the authorities are addresses
  if (seller.map((x) => asAddress(x)).length !== seller.length) {
    console.log(`${name}: Invalid address: ${terms.seller}`)
    return false
  }
  return true
}
