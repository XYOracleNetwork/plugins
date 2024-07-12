import { ElevationPayload } from './Payload.js'
import { ElevationSchema } from './Schema.js'

export const elevationPayloadTemplate = (): ElevationPayload => {
  return {
    elevation: undefined,
    schema: ElevationSchema,
  }
}
