import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import type {
  AsyncPayloadValidationFunction, Payload, SyncPayloadValidationFunction, WithMeta,
} from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'
import { getPartySecretSignedValidator } from '../common/index.ts'

const name = 'EscrowTerms.buyerSecret'

/**
 * Returns a function that validates the escrow terms for buyerSecret
 * @returns A function that validates the escrow terms for buyerSecret
 */
export const buyerSecretExistsValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have buyerSecret
  const buyerSecret = terms.buyerSecret
  if (!buyerSecret || buyerSecret.length === 0) {
    console.log(`${name}: No buyerSecret: ${terms.buyerSecret}`)
    return false
  }
  return true
}

/**
 * Returns a function that validates the escrow terms for the existence of the buyerSecret in the dictionary
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for the existence of the buyerSecret in the dictionary
 */
export const getBuyerSecretSuppliedValidator = (dictionary: Record<Hash, WithMeta<Payload>>): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const buyerSecret = assertEx(terms.buyerSecret, () => `${name}: No buyerSecret: ${terms.buyerSecret}`)
    if (!dictionary[buyerSecret]) {
      console.log(`${name}: Payload not supplied for buyerSecret: ${buyerSecret}`)
      return false
    }
    return true
  }
}

/**
 * Returns a function that validates the escrow terms for the existence of the buyerSecret signed by the buyer
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for the existence of the buyerSecret signed by the buyer
 */
export const getBuyerSecretSignedValidator = (dictionary: Record<Hash, WithMeta<Payload>>): AsyncPayloadValidationFunction<EscrowTerms> => {
  return getPartySecretSignedValidator(dictionary, 'buyer')
}
