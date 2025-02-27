import { Hash } from '@xylabs/hex'
import { BoundWitnessValidator } from '@xyo-network/boundwitness-validator'
import { AsyncPayloadValidationFunction, Payload } from '@xyo-network/payload-model'

import {
  EscrowParty, EscrowPartySecret, EscrowTerms,
} from '../../../Terms/index.ts'
import { findEscrowPartySecretSignatures } from '../../../util/index.ts'

/**
 * Returns the log prefix for the party
 * @param party The party
 * @returns The log prefix for the party
 */
const getLogPrefix = (party: EscrowParty) => {
  const partySecret: EscrowPartySecret = party === 'seller' ? 'sellerSecret' : 'buyerSecret'
  return `EscrowTerms.${partySecret}`
}

/**
 * Returns a function that validates the escrow terms for the existence of the party secret signed by the party
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for the existence of the party secret signed by the party
 */
export const getPartySecretSignedValidator = (dictionary: Record<Hash, Payload>, party: EscrowParty): AsyncPayloadValidationFunction<EscrowTerms> => {
  const partySecret: EscrowPartySecret = party === 'seller' ? 'sellerSecret' : 'buyerSecret'
  return async (terms: EscrowTerms): Promise<boolean> => {
    // Party-signed party secret BWs
    const buyerSecretBWs = findEscrowPartySecretSignatures(terms, dictionary, party)

    // If there are no BWs, return false
    if (buyerSecretBWs.length === 0) {
      console.log(`${getLogPrefix(party)}: No BoundWitnesses supplied for ${partySecret}: ${terms[partySecret]}`)
      return false
    }

    // Ensure each BW supplied for the party secret is valid
    const errors = await Promise.all(buyerSecretBWs.map(bw => new BoundWitnessValidator(bw).validate()))
    const validBoundWitnesses = errors.every(errors => errors.length === 0)
    if (!validBoundWitnesses) {
      console.log(`${getLogPrefix(party)}: Invalid BoundWitnesses supplied for ${partySecret}: ${terms[partySecret]}`)
      return false
    }
    return true
  }
}
