import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import { PayloadBuilder } from '@xyo-network/sdk-js'

import type { DurationFields } from '../Duration.ts'

// BW & Record Validations
export const validateBoundWitnessAndDuration = async (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): Promise<boolean> => {
  if (!(await recordIsInBoundWitness(recordBw, recordPayload))) return false
  return (recordIsTemporallyValidToBoundWitness(recordBw, recordPayload))
}

const recordIsInBoundWitness = async (recordBw: BoundWitness, recordPayload: Payload): Promise<boolean> => {
  const hash = await PayloadBuilder.dataHash(recordPayload)
  return recordBw.payload_hashes.includes(hash)
}

// TODO: Use sequence for this?
const recordIsTemporallyValidToBoundWitness = (_recordBw: BoundWitness, _recordPayload: Payload<DurationFields>): boolean => {
  /* const { timestamp } = recordBw
  const { exp } = recordPayload
  return exp > timestamp */
  return true
}
