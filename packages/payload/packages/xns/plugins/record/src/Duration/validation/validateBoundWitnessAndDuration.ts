import { BoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../Duration.ts'

// BW & Record Validations
export const validateBoundWitnessAndDuration = async (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): Promise<boolean> => {
  if (!(await recordIsInBoundWitness(recordBw, recordPayload))) return false
  if (!recordIsTemporallyValidToBoundWitness(recordBw, recordPayload)) return false
  return true
}

const recordIsInBoundWitness = async (recordBw: BoundWitness, recordPayload: Payload): Promise<boolean> => {
  const hash = await PayloadBuilder.dataHash(recordPayload)
  return recordBw.payload_hashes.includes(hash)
}

const recordIsTemporallyValidToBoundWitness = (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): boolean => {
  const { timestamp } = recordBw
  const { exp } = recordPayload
  return exp > timestamp
}
