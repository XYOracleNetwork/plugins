import { DurationFields } from '@xyo-network/xns-record-payload-plugins'

const FIVE_MINUTES = 1000 * 60 * 5

/**
 * Validates that the current time is within the duration window, within a configurable a buffer
 * @param value The duration value
 * @param windowMs The window in milliseconds to allow for a buffer
 * @returns True if the duration is valid, false otherwise
 */
export const validateDuration = (value: Partial<DurationFields>, windowMs = FIVE_MINUTES): boolean => {
  const now = Date.now()
  if (!value.nbf || value.nbf > now) return false
  // If already expired (include for a 5 minute buffer to allow for a reasonable
  // minimum amount of time for the transaction to be processed)
  return !(!value.exp || value.exp - now < windowMs)
}
