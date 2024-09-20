import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import type { Payload, WithMeta } from '@xyo-network/payload-model'

import type {
  EscrowParty, EscrowPartySecret, EscrowTerms,
} from '../../Terms.ts'

/**
 * Returns the log prefix for the party
 * @param party The party
 * @returns The log prefix for the party
 */
const getLogPrefix = (party: EscrowParty) => party === 'seller' ? 'EscrowTerms.sellerSecret' : 'EscrowTerms.buyerSecret'

/**
 * Returns an array of BoundWitnesses containing the secret signed by all the parties
 * @param terms The escrow terms
 * @param dictionary A dictionary of all the payloads associated with the escrow
 * @param party The party to get the secret signatures for
 * @returns An array of BoundWitnesses containing the secret signed by all the parties
 */
export const getEscrowPartySecretSignatures = (terms: EscrowTerms, dictionary: Record<Hash, WithMeta<Payload>>, party: EscrowParty) => {
  const partyAddresses = assertEx(terms[party], () => `${getLogPrefix(party)}: No ${party}: ${terms[party]}`)
  const partySecret: EscrowPartySecret = party === 'seller' ? 'sellerSecret' : 'buyerSecret'
  const secretHash = assertEx(terms[partySecret], () => `${getLogPrefix(party)}: No ${partySecret}: ${terms[partySecret]}`)
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
