import { ModuleIdentifier } from '@xyo-network/module-model'
import { EscrowTerms } from '@xyo-network/payment-payload-plugins'

import { moduleIdentifiersContainsOneOf } from '../common'
import { EscrowTermsValidationFunction } from '../types'

const name = 'EscrowTerms.escrowAgent'

export const getEscrowAgentAllowedValidator = (allowedEscrowAgent: ModuleIdentifier): EscrowTermsValidationFunction => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsOneOf(terms, (t) => t.escrowAgent, [allowedEscrowAgent], true)
    if (!result) {
      console.log(`${name}: Escrow agent not allowed: ${terms.escrowAgent}`)
    }
    return result
  }
}
