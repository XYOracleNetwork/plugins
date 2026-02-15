import type { Hash } from '@xylabs/sdk-js'
import { assertEx } from '@xylabs/sdk-js'
import type {
  AsyncPayloadValidationFunction, Payload, SyncPayloadValidationFunction,
} from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'
import { getPartySecretSignedValidator } from '../common/index.ts'

const name = 'EscrowTerms.sellerSecret'

/**
 * Returns a function that validates the escrow terms for sellerSecret
 * @returns A function that validates the escrow terms for sellerSecret
 */
export const sellerSecretExistsValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have sellerSecret
  const sellerSecret = terms.sellerSecret
  if (!sellerSecret || sellerSecret.length === 0) {
    console.log(`${name}: No sellerSecret: ${terms.sellerSecret}`)
    return false
  }
  return true
}

/**
 * Returns a function that validates the escrow terms for the existence of the sellerSecret in the dictionary
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for the existence of the sellerSecret in the dictionary
 */
export const getSellerSecretSuppliedValidator = (dictionary: Record<Hash, Payload>): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const sellerSecret = assertEx(terms.sellerSecret, () => `${name}: No sellerSecret: ${terms.sellerSecret}`)
    if (!dictionary[sellerSecret]) {
      console.log(`${name}: Payload not supplied for sellerSecret: ${sellerSecret}`)
      return false
    }
    return true
  }
}

/**
 * Returns a function that validates the escrow terms for the existence of the sellerSecret signed by the seller
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for the existence of the sellerSecret signed by the seller
 */
export const getSellerSecretSignedValidator = (dictionary: Record<Hash, Payload>): AsyncPayloadValidationFunction<EscrowTerms> => {
  return getPartySecretSignedValidator(dictionary, 'seller')
}
