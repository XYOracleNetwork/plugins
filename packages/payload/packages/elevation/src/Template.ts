import type { ElevationPayload } from './Payload.ts'
import { ElevationSchema } from './Schema.ts'

export const elevationPayloadTemplate = (): ElevationPayload => {
  return {
    elevation: undefined,
    schema: ElevationSchema,
  }
}
