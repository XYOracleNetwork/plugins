import { asAddress } from '@xylabs/hex'
import { ModuleIdentifier } from '@xyo-network/module-model'
import { EscrowTerms } from '@xyo-network/payment-payload-plugins'

import { moduleIdentifiersContainsAllOf } from '../common'
import { EscrowTermsValidationFunction } from '../types'

const name = 'EscrowTerms.appraisalAuthorities'

/**
 * A function that validates the escrow terms for appraisalAuthorities
 * @returns True if the escrow terms contain appraisalAuthorities, false otherwise
 */
export const appraisalAuthoritiesExistValidator: EscrowTermsValidationFunction = (terms: EscrowTerms) => {
  // Validate we have appraisalAuthorities
  const appraisalAuthorities = terms.appraisalAuthorities
  if (!appraisalAuthorities || appraisalAuthorities.length === 0) {
    console.log(`${name}: No appraisalAuthorities: ${terms.appraisalAuthorities}`)
    return false
  }
  // Validate the authorities are addresses
  if (appraisalAuthorities.map((x) => asAddress(x)).length !== appraisalAuthorities.length) {
    console.log(`${name}: Invalid address: ${terms.appraisalAuthorities}`)
    return false
  }
  return true
}

export const getAppraisalAuthoritiesAllowedValidator = (allowed: ModuleIdentifier[]): EscrowTermsValidationFunction => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsAllOf(terms, (t) => t.appraisalAuthorities, allowed, true)
    if (!result) {
      console.log(`${name}: Appraisal authority not allowed: ${terms.appraisalAuthorities}`)
    }
    return result
  }
}
