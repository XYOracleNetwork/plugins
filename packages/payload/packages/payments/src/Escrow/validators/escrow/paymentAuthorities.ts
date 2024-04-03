import { ModuleIdentifier } from '@xyo-network/module-model'

import { EscrowTerms } from '../../Terms'
import { moduleIdentifiersContainsAllOf } from '../common'
import { EscrowTermsValidationFunction } from '../types'

const name = 'EscrowTerms.paymentAuthorities'

export const getPaymentAuthoritiesAllowedValidator = (allowed: ModuleIdentifier[]): EscrowTermsValidationFunction => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsAllOf(terms, (t) => t.paymentAuthorities, allowed, true)
    if (!result) {
      console.log(`${name}: Payment authority not allowed: ${terms.paymentAuthorities}`)
    }
    return result
  }
}
