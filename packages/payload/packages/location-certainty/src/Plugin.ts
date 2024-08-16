import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { LocationCertaintyPayload } from './Payload.ts'
import { LocationCertaintySchema } from './Schema.ts'

export const LocationCertaintyPayloadPlugin = () =>
  createPayloadPlugin<LocationCertaintyPayload>({
    schema: LocationCertaintySchema,
  })
