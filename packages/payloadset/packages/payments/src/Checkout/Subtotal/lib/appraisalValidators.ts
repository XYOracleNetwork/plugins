import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'

import { isIso4217CurrencyCode } from '../../Amount/index.ts'
import { validateDuration } from './durationValidators.ts'

const validateAppraisalAmount = (appraisals: HashLeaseEstimate[]): boolean => {
  // Ensure all appraisals are numeric
  if (appraisals.some(appraisal => typeof appraisal.price !== 'number')) return false
  // Ensure all appraisals are positive numbers
  if (appraisals.some(appraisal => appraisal.price < 0)) return false
  return true
}

const validateAppraisalCurrency = (appraisals: HashLeaseEstimate[]): boolean => {
  // NOTE: Only supporting USD for now, the remaining checks are for future-proofing.
  if (!appraisals.every(appraisal => appraisal.currency == 'USD')) return false

  // Check every object in the array to ensure they all are in a supported currency.
  if (!appraisals.every(appraisal => isIso4217CurrencyCode(appraisal.currency))) return false

  return true
}

const validateAppraisalConsistentCurrency = (appraisals: HashLeaseEstimate[]): boolean => {
  // Check if the array is empty or contains only one element, no need to compare.
  if (appraisals.length <= 1) return true

  // Get the currency of the first element to compare with others.
  const { currency } = appraisals[0]
  if (!currency) return false

  // Check every object in the array to ensure they all have the same currency.
  if (!appraisals.every(item => item.currency === currency)) return false

  return true
}

const validateAppraisalWindow = (appraisals: HashLeaseEstimate[]): boolean => appraisals.every(validateDuration)

export const appraisalValidators = [
  validateAppraisalAmount,
  validateAppraisalCurrency,
  validateAppraisalConsistentCurrency,
  validateAppraisalWindow,
]
