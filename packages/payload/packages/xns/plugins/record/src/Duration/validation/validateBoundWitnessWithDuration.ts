import { BoundWitness } from '@xyo-network/boundwitness-model'
import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../Duration'
import { validateBoundWitness } from './validateBoundWitness'
import { validateBoundWitnessAndDuration } from './validateBoundWitnessAndDuration'
import { validateDuration } from './validateDuration'

export const validateBoundWitnessWithDuration = async (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): Promise<boolean> => {
  // Validate the BW
  if (!(await validateBoundWitness(recordBw, [recordPayload.schema]))) return false
  // Validate the record
  if (!validateDuration(recordPayload)) return false
  // Validate the record relative to the BW
  if (!(await validateBoundWitnessAndDuration(recordBw, recordPayload))) return false
  return true
}
