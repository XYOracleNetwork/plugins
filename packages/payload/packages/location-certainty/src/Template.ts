import { LocationCertaintyPayload } from './Payload.ts'
import { LocationCertaintySchema } from './Schema.ts'

export const LocationCertaintyPayloadTemplate = (): Partial<LocationCertaintyPayload> => {
  return {
    altitude: undefined,
    certainty: undefined,
    elevation: undefined,
    schema: LocationCertaintySchema,
    variance: undefined,
  }
}
