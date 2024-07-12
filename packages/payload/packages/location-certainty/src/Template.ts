import { LocationCertaintyPayload } from './Payload.js'
import { LocationCertaintySchema } from './Schema.js'

export const LocationCertaintyPayloadTemplate = (): Partial<LocationCertaintyPayload> => {
  return {
    altitude: undefined,
    certainty: undefined,
    elevation: undefined,
    schema: LocationCertaintySchema,
    variance: undefined,
  }
}
