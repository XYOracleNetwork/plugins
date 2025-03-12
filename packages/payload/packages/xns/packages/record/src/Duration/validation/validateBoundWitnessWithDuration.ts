import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'

import type { DurationFields } from '../Duration.ts'
import { validateBoundWitness } from './validateBoundWitness.ts'
import { validateBoundWitnessAndDuration } from './validateBoundWitnessAndDuration.ts'
import { validateDuration } from './validateDuration.ts'

export const validateBoundWitnessWithDuration = async (recordBw: BoundWitness, recordPayload: Payload<DurationFields>): Promise<boolean> => {
  // Validate the BW
  if (!(await validateBoundWitness(recordBw, [recordPayload.schema]))) return false
  // Validate the record
  if (!validateDuration(recordPayload)) return false
  // Validate the record relative to the BW
  return (await validateBoundWitnessAndDuration(recordBw, recordPayload))
}
