import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import { BoundWitnessValidator } from '@xyo-network/boundwitness-validator'
import type {
  AsyncPayloadValidationFunction, Payload, SyncPayloadValidationFunction, WithMeta,
} from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

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
  return async (terms: EscrowTerms): Promise<boolean> => {
    const buyer = assertEx(terms.buyer, () => `${name}: No buyer: ${terms.buyer}`)
    const buyerSecret = assertEx(terms.buyerSecret, () => `${name}: No buyerSecret: ${terms.buyerSecret}`)
    // Buyer-signed buyer secrets
    const buyerSecretBWs = Object.values(dictionary)
      // Find all BoundWitnesses
      .filter(isBoundWitnessWithMeta)
      // That contain the buyer secret
      .filter(bw => bw.payload_hashes.includes(buyerSecret))
      // That are signed by all the buyers
      .filter(bw => buyer.every(buyerAddress => bw.addresses.includes(buyerAddress)))

    // If there are no buyerSecret BWs, return false
    if (buyerSecretBWs.length === 0) {
      console.log(`${name}: No BoundWitnesses supplied for buyerSecret: ${buyerSecret}`)
      return false
    }

    // Ensure each BW supplied for the buyerSecret is valid
    const errors = await Promise.all(buyerSecretBWs.map(bw => new BoundWitnessValidator(bw).validate()))
    const validBoundWitnesses = errors.every(errors => errors.length === 0)
    if (!validBoundWitnesses) {
      console.log(`${name}: Invalid BoundWitnesses supplied for buyerSecret: ${buyerSecret}`)
      return false
    }
    return true
  }
}
