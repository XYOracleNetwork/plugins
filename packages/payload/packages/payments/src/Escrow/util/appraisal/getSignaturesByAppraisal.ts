import type { Hash } from '@xylabs/hex'
import { type BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

/**
 * Returns a dictionary of appraisals and their associated bound witnesses which are signed by
 * valid appraisal authorities from the escrow terms
 * @param terms The escrow terms
 * @param dictionary The diction of payloads associated with the escrow terms
 * @returns A dictionary of appraisals and their associated bound witnesses
 */
export const getSignaturesByAppraisal = (
  terms: EscrowTerms,
  dictionary: Record<Hash, Payload>,
): Record<Hash, BoundWitness[]> => {
  // Validate inputs
  const appraisals = terms.appraisals
  if (!appraisals || appraisals.length === 0) return {}
  const appraisalAuthorities = terms.appraisalAuthorities
  if (!appraisalAuthorities || appraisalAuthorities.length === 0) return {}

  // Validate the appraisals are signed by valid appraisal authorities. Validation criteria:
  // - The bw includes the appraisal hash from the escrow terms appraisal
  // - The bw is signed by an approved appraisal authority from the escrow terms appraisalAuthorities
  const appraisalBWsValid: Record<Hash, BoundWitness[]> = Object.fromEntries(
    appraisals.map<[Hash, BoundWitness[]]>(hash => [hash, []]),
  )
  for (const bw of Object.values(dictionary).filter(isBoundWitness)) {
    for (const appraisal of appraisals) {
      if (bw.payload_hashes.includes(appraisal) && bw.addresses.some(address => appraisalAuthorities.includes(address))) {
        appraisalBWsValid[appraisal].push(bw)
      }
    }
  }

  return appraisalBWsValid
}
