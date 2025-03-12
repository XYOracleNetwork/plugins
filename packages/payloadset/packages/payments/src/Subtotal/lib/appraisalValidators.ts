import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { isIso4217CurrencyCode } from '@xyo-network/payment-payload-plugins'

import { validateDuration } from './durationValidators.ts'

const validateAppraisalAmount = (appraisals: HashLeaseEstimate[]): boolean => {
  // Ensure all appraisals are numeric
  if (appraisals.some(appraisal => typeof appraisal.price !== 'number')) return false
  // Ensure all appraisals are positive numbers
  return !(appraisals.some(appraisal => appraisal.price < 0))
}

const validateAppraisalCurrency = (appraisals: HashLeaseEstimate[]): boolean => {
  // NOTE: Only supporting USD for now, the remaining checks are for future-proofing.
  if (!appraisals.every(appraisal => appraisal.currency == 'USD')) return false

  // Check every object in the array to ensure they all are in a supported currency.
  return (appraisals.every(appraisal => isIso4217CurrencyCode(appraisal.currency)))
}

const validateAppraisalConsistentCurrency = (appraisals: HashLeaseEstimate[]): boolean => {
  // Check if the array is empty or contains only one element, no need to compare.
  if (appraisals.length <= 1) return true

  // Get the currency of the first element to compare with others.
  const { currency } = appraisals[0]
  if (!currency) return false

  // Check every object in the array to ensure they all have the same currency.
  return (appraisals.every(item => item.currency === currency))
}

const validateAppraisalWindow = (appraisals: HashLeaseEstimate[]): boolean => appraisals.every(validateDuration)

export const appraisalValidators = [
  validateAppraisalAmount,
  validateAppraisalCurrency,
  validateAppraisalConsistentCurrency,
  validateAppraisalWindow,
]
