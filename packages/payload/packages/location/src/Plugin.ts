import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { LocationPayload } from './GeographicCoordinateSystemLocationPayload.js'
import { LocationSchema } from './GeographicCoordinateSystemLocationSchema.js'

export const LocationPayloadPlugin = () =>
  createPayloadPlugin<LocationPayload>({
    schema: LocationSchema,
  })
