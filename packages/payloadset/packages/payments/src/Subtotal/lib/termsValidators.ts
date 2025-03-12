import type { Hash } from '@xylabs/hex'
import type { EscrowTerms } from '@xyo-network/payment-payload-plugins'

import { validateDuration } from './durationValidators.ts'

export type ValidEscrowTerms = Required<EscrowTerms>

const validateTermsAppraisals = (terms: EscrowTerms): terms is Required<EscrowTerms & { appraisals: Hash[] }> => {
  if (!terms.appraisals) return false
  return terms.appraisals.length > 0
}
const validateTermsWindow = (terms: EscrowTerms): boolean => validateDuration(terms)

export const termsValidators = [
  validateTermsAppraisals,
  validateTermsWindow,
]
