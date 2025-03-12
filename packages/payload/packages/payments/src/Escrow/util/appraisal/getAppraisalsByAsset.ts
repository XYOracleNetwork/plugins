import type { Hash } from '@xylabs/hex'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { isHashLeaseEstimateWithSources } from '@xyo-network/diviner-hash-lease'
import type { Payload, WithSources } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

/**
 * Returns a dictionary of asset hashes and their associated appraisals
 * @param terms The escrow terms
 * @param dictionary The dictionary of payloads associated with the escrow terms
 * @returns A dictionary of asset hashes and their associated appraisals
 */
export const getAppraisalsByAsset = (terms: EscrowTerms, dictionary: Record<Hash, Payload>): Record<Hash, WithSources<HashLeaseEstimate>[]> => {
  const assets = terms.assets
  if (!assets || assets.length === 0) return {}
  const appraisals = Object.values(dictionary).filter(isHashLeaseEstimateWithSources) as unknown as WithSources<HashLeaseEstimate>[]
  const appraisalsByAsset: Record<Hash, WithSources<HashLeaseEstimate>[]> = {}
  for (const estimate of appraisals) {
    const { $sources } = estimate
    if ($sources === undefined || $sources.length === 0) {
      continue
    }
    for (const asset of assets) {
      if ($sources.includes(asset)) {
        if (!appraisalsByAsset[asset]) appraisalsByAsset[asset] = []
        appraisalsByAsset[asset].push(estimate)
      }
    }
  }
  return appraisalsByAsset
}
