import { ModuleIdentifier } from '@xyo-network/module-model'
import { PayloadValidationFunction } from '@xyo-network/payload-model'

import { EscrowTerms } from '../../Terms.js'
import { moduleIdentifiersContainsOneOf } from '../common/index.js'

const name = 'EscrowTerms.escrowAgent'

export const getEscrowAgentAllowedValidator = (allowedEscrowAgent: ModuleIdentifier): PayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsOneOf(terms, (t) => t.escrowAgent, [allowedEscrowAgent], true)
    if (!result) {
      console.log(`${name}: Escrow agent not allowed: ${terms.escrowAgent}`)
    }
    return result
  }
}
