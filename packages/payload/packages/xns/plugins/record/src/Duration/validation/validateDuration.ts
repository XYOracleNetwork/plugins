// import { isAddress } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'

import type { DurationFields } from '../Duration.ts'

// Record Validations
export const validateDuration = (recordPayload: Payload<DurationFields>): boolean => {
  // if (!isValidAddress(recordPayload)) return false
  if (!isWithinDelegatedTimeframe(recordPayload)) return false
  return true
}

// const isValidAddress = (recordPayload: Payload<DomainLeaseFields>): boolean => {
//   return isAddress(recordPayload.nameserver, { prefix: false })
// }

const isWithinDelegatedTimeframe = (recordPayload: Payload<DurationFields>, now = Date.now()): boolean => {
  // nbf < now < exp
  return recordPayload.nbf < now && now < recordPayload.exp
}
