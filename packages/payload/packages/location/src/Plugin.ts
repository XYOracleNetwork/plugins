import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { LocationPayload } from './GeographicCoordinateSystemLocationPayload.ts'
import { LocationSchema } from './GeographicCoordinateSystemLocationSchema.ts'

export const LocationPayloadPlugin = () =>
  createPayloadPlugin<LocationPayload>({
    schema: LocationSchema,
  })
