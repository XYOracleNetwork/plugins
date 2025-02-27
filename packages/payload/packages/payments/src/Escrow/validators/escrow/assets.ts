import { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import { EscrowTerms } from '../../Terms/index.ts'

const name = 'EscrowTerms.assets'

/**
 * Returns a function that validates the escrow terms for assets
 * @returns A function that validates the escrow terms for assets
 */
export const assetsExistValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have assets
  const assets = terms.assets
  if (!assets || assets.length === 0) {
    console.log(`${name}: No assets: ${terms.assets}`)
    return false
  }
  return true
}
