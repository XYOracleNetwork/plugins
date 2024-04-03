import { EscrowTerms } from '@xyo-network/payment-payload-plugins'

import { EscrowTermsValidationFunction } from '../types'

const name = 'EscrowTerms.assets'

/**
 * Returns a function that validates the escrow terms for assets
 * @returns A function that validates the escrow terms for assets
 */
export const assetsExistValidator: EscrowTermsValidationFunction = (terms: EscrowTerms) => {
  // Validate we have assets
  const assets = terms.assets
  if (!assets || assets.length === 0) {
    console.log(`${name}: No assets: ${terms.assets}`)
    return false
  }
  return true
}
