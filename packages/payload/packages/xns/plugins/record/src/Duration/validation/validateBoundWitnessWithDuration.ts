import { BoundWitness } from '@xyo-network/boundwitness-model'
import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../Duration.ts'
import { validateBoundWitness } from './validateBoundWitness.ts'
import { validateBoundWitnessAndDuration } from './validateBoundWitnessAndDuration.ts'
import { validateDuration } from './validateDuration.ts'

export const validateBoundWitnessWithDuration = async (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): Promise<boolean> => {
  // Validate the BW
  if (!(await validateBoundWitness(recordBw, [recordPayload.schema]))) return false
  // Validate the record
  if (!validateDuration(recordPayload)) return false
  // Validate the record relative to the BW
  if (!(await validateBoundWitnessAndDuration(recordBw, recordPayload))) return false
  return true
}
