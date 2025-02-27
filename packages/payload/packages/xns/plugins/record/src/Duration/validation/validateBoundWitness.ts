import { BoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessValidator } from '@xyo-network/boundwitness-validator'

// BW Validations
export const validateBoundWitness = async (recordBw: BoundWitness, requiredSchemas: string[] = []): Promise<boolean> => {
  // If the BW does not include all of the required schemas
  if (!requiredSchemas.every(requiredSchema => recordBw.payload_schemas.includes(requiredSchema))) return false
  // If the BW is valid (does not include any errors)
  const validator = new BoundWitnessValidator(recordBw)
  const errors = await validator.validate()
  return errors.length === 0
}
