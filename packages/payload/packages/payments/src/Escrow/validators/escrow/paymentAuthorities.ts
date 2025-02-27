import { ModuleIdentifier } from '@xyo-network/module-model'
import { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import { EscrowTerms } from '../../Terms/index.ts'
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
