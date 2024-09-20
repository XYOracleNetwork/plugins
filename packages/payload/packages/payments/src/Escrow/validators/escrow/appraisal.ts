import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { isHashLeaseEstimateWithSources } from '@xyo-network/diviner-hash-lease'
import type {
  Payload, SyncPayloadValidationFunction, WithMeta, WithSources,
} from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'
import { validateWithinWindow } from '../common/index.ts'

const name = 'EscrowTerms.appraisal'

/**
 * A function that validates the escrow terms for tbe existence of appraisals
 * @returns True if the escrow terms contain appraisals, false otherwise
 */
export const appraisalsExistValidator: SyncPayloadValidationFunction<EscrowTerms> = (terms: EscrowTerms) => {
  // Validate we have appraisals
  const appraisals = terms.appraisals
  if (!appraisals || appraisals.length === 0) {
    console.log(`${name}: No appraisals: ${terms.appraisals}`)
    return false
  }
  return true
}

/**
 * Returns a function that validates the escrow terms for appraisals which are from valid authorities
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for appraisals which are from valid authorities
 */
export const getAppraisalsFromValidAuthoritiesValidator = (dictionary: Record<Hash, WithMeta<Payload>>): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const appraisals = assertEx(terms.appraisals, () => `${name}: No appraisals: ${terms.appraisals}`)
    const appraisalAuthorities = assertEx(terms.appraisalAuthorities, () => `${name}: No appraisalAuthorities: ${terms.appraisalAuthorities}`)

    // Validate the appraisals are signed by valid appraisal authorities. Validation criteria:
    // - We have a bw for each of the appraisal
    // - The bw is signed by an approved appraisal authority
    const appraisalBWsValid: Record<Hash, WithMeta<BoundWitness>[]> = Object.fromEntries(
      appraisals.map<[Hash, WithMeta<BoundWitness>[]]>(hash => [hash, []]),
    )
    for (const bw of Object.values(dictionary).filter(isBoundWitnessWithMeta)) {
      for (const appraisal of appraisals) {
        if (bw.payload_hashes.includes(appraisal) && bw.addresses.some(address => appraisalAuthorities.includes(address))) {
          appraisalBWsValid[appraisal].push(bw)
        }
      }
    }
    for (const [appraisal, bws] of Object.entries(appraisalBWsValid)) {
      if (bws.length === 0) {
        console.log(`${name}: No valid appraisals for ${appraisal}`)
        return false
      }
    }
    return true
  }
}

/**
 * Returns a function that validates the escrow terms for appraisals which are valid
 * @param dictionary Payload dictionary of the escrow terms
 * @param minimumExp The minium amount of time an estimate needs to be valid
 * for in the future (so as not to expire before the escrow is complete)
 * @returns A function that validates the escrow terms for appraisals which are valid
 */
export const getAppraisalsValidValidator = (
  dictionary: Record<Hash, WithMeta<Payload>>,
  minimumExp: number,
): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    // Verify we have an estimate for each of the assets
    const estimatesByAsset = getEstimatesByAsset(terms, dictionary)
    // Validate each of the estimates are valid (time, price, etc)
    const now = Date.now()
    const exp = now + minimumExp
    for (const [asset, estimates] of Object.entries(estimatesByAsset)) {
      for (const estimate of estimates) {
        if (!validateEstimate(estimate, exp)) {
          console.log(`${name}: Invalid estimate for asset ${asset}: ${estimate}`)
          return false
        }
      }
    }
    return true
  }
}

/**
 * Returns a function that validates the escrow terms to ensure that they contain an appraisal for each asset
 * @param dictionary Payload dictionary of the escrow terms
 * @returns A function that validates the escrow terms for appraisals
 */
export const getAppraisalsForAllAssetsValidator = (dictionary: Record<Hash, WithMeta<Payload>>): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    // Verify we have an estimate for each of the assets
    const estimatesByAsset = getEstimatesByAsset(terms, dictionary)
    const assets = assertEx(terms.assets, () => `${name}: No assets: ${terms.assets}`)
    if (Object.keys(estimatesByAsset).length !== assets.length) {
      console.log(`${name}: Missing appraisals for all assets: ${assets}`)
      return false
    }
    return true
  }
}

const validateEstimate = (estimate: WithSources<HashLeaseEstimate>, exp: number): boolean => {
  if (!validateWithinWindow(estimate, exp)) return false
  if (estimate.currency !== 'USD') return false
  if (estimate.price <= 0) return false
  return true
}

const getEstimatesByAsset = (terms: EscrowTerms, dictionary: Record<Hash, WithMeta<Payload>>): Record<Hash, WithSources<HashLeaseEstimate>[]> => {
  const assets = assertEx(terms.assets, () => `${name}: No assets: ${terms.assets}`)
  const estimates = Object.values(dictionary).filter(isHashLeaseEstimateWithSources) as unknown as WithSources<HashLeaseEstimate>[]
  const estimatesByAsset: Record<Hash, WithSources<HashLeaseEstimate>[]> = {}
  for (const estimate of estimates) {
    const { sources } = estimate
    if (sources === undefined || sources.length === 0) {
      console.log(`${name}: No sources: ${estimate}`)
      continue
    }
    for (const asset of assets) {
      if (sources.includes(asset)) {
        if (!estimatesByAsset[asset]) estimatesByAsset[asset] = []
        estimatesByAsset[asset].push(estimate)
      }
    }
  }
  return estimatesByAsset
}
