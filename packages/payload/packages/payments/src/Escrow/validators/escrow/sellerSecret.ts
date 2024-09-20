import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import { BoundWitnessValidator } from '@xyo-network/boundwitness-validator'
import type {
  AsyncPayloadValidationFunction, Payload, SyncPayloadValidationFunction, WithMeta,
} from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

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
export const getSellerSecretSuppliedValidator = (dictionary: Record<Hash, WithMeta<Payload>>): SyncPayloadValidationFunction<EscrowTerms> => {
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
export const getSellerSecretSignedValidator = (dictionary: Record<Hash, WithMeta<Payload>>): AsyncPayloadValidationFunction<EscrowTerms> => {
  return async (terms: EscrowTerms): Promise<boolean> => {
    const seller = assertEx(terms.seller, () => `${name}: No seller: ${terms.seller}`)
    const sellerSecret = assertEx(terms.sellerSecret, () => `${name}: No sellerSecret: ${terms.sellerSecret}`)
    // Seller-signed seller secrets
    const sellerSecretBWs = Object.values(dictionary)
      // Find all BoundWitnesses
      .filter(isBoundWitnessWithMeta)
      // That contain the seller secret
      .filter(bw => bw.payload_hashes.includes(sellerSecret))
      // That are signed by all the sellers
      .filter(bw => seller.every(sellerAddress => bw.addresses.includes(sellerAddress)))

    // If there are no sellerSecret BWs, return false
    if (sellerSecretBWs.length === 0) {
      console.log(`${name}: No BoundWitnesses supplied for sellerSecret: ${sellerSecret}`)
      return false
    }

    // Ensure each BW supplied for the sellerSecret is valid
    const errors = await Promise.all(sellerSecretBWs.map(bw => new BoundWitnessValidator(bw).validate()))
    const validBoundWitnesses = errors.every(errors => errors.length === 0)
    if (!validBoundWitnesses) {
      console.log(`${name}: Invalid BoundWitnesses supplied for sellerSecret: ${sellerSecret}`)
      return false
    }
    return true
  }
}
