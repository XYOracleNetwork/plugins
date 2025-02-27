import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../Duration.ts'

// Record Validations
export const validateDuration = (recordPayload: Payload<DurationFields>): boolean => {
  // if (!isValidAddress(recordPayload)) return false
  return isWithinDelegatedTimeframe(recordPayload)
}

export const isWithinDelegatedTimeframe = (recordPayload: Payload<DurationFields>, now = Date.now()): boolean => {
  // nbf < now < exp
  return recordPayload.nbf < now && now < recordPayload.exp
}
