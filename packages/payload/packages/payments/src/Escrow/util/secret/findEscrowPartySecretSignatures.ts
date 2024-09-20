import type { Hash } from '@xylabs/hex'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import type { Payload, WithMeta } from '@xyo-network/payload-model'

import type {
  EscrowParty, EscrowPartySecret, EscrowTerms,
} from '../../Terms/index.ts'
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
 * Returns an array of BoundWitnesses containing the secret signed by all the parties
 * @param terms The escrow terms
 * @param dictionary A dictionary of all the payloads associated with the escrow
 * @param party The party to get the secret signatures for
 * @returns An array of BoundWitnesses containing the secret signed by all the parties
 */
export const findEscrowPartySecretSignatures = (terms: EscrowTerms, dictionary: Record<Hash, WithMeta<Payload>>, party: EscrowParty): BoundWitness[] => {
  const partyAddresses = terms[party]
  if (partyAddresses === undefined || partyAddresses.length === 0) {
    console.log(`${getLogPrefix(party)}: No ${party}: ${terms[party]}`)
    return []
  }
  const partySecret: EscrowPartySecret = party === 'seller' ? 'sellerSecret' : 'buyerSecret'
  const secretHash = terms[partySecret]
  if (secretHash === undefined) {
    console.log(`${getLogPrefix(party)}: No ${partySecret}: ${terms[partySecret]}`)
    return []
  }
  // BWs containing the secret signed by all the parties
  const partySignedBWs = Object.values(dictionary)
    // Find all BoundWitnesses
    .filter(isBoundWitnessWithMeta)
    // That contain the seller secret
    .filter(bw => bw.payload_hashes.includes(secretHash))
    // That are signed by all the parties
    .filter(bw => partyAddresses.every(address => bw.addresses.includes(address)))
  return partySignedBWs
}
