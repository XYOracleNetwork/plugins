import type { ModuleIdentifier } from '@xyo-network/module-model'
import type { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms.ts'
import { moduleIdentifiersContainsOneOf } from '../common/index.ts'

const name = 'EscrowTerms.escrowAgent'

export const getEscrowAgentAllowedValidator = (allowedEscrowAgent: ModuleIdentifier): SyncPayloadValidationFunction<EscrowTerms> => {
  return (terms: EscrowTerms) => {
    const result = moduleIdentifiersContainsOneOf(terms, t => t.escrowAgent, [allowedEscrowAgent], true)
    if (!result) {
      console.log(`${name}: Escrow agent not allowed: ${terms.escrowAgent}`)
    }
    return result
  }
}
