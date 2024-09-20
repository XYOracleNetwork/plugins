import type { ModuleIdentifier } from '@xyo-network/module-model'
import type { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms.ts'
import { moduleIdentifiersContainsAllOf } from '../common/index.ts'

const name = 'EscrowTerms.paymentAuthorities'

export const getPaymentAuthoritiesAllowedValidator = (allowed: ModuleIdentifier[]): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsAllOf(terms, t => t.paymentAuthorities, allowed, true)
    if (!result) {
      console.log(`${name}: Payment authority not allowed: ${terms.paymentAuthorities}`)
    }
    return result
  }
}
