import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessValidator } from '@xyo-network/boundwitness-validator'
import type { Schema } from '@xyo-network/payload-model'

// BW Validations
export const validateBoundWitness = async (recordBw: BoundWitness, requiredSchemas: Schema[] = []): Promise<boolean> => {
  // If the BW does not include all of the required schemas
  if (!requiredSchemas.every(requiredSchema => recordBw.payload_schemas.includes(requiredSchema))) return false
  // If the BW is valid (does not include any errors)
  const validator = new BoundWitnessValidator(recordBw)
  const errors = await validator.validate()
  return errors.length === 0
}
