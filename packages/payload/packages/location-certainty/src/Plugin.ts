import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { LocationCertaintyPayload } from './Payload.js'
import { LocationCertaintySchema } from './Schema.js'

export const LocationCertaintyPayloadPlugin = () =>
  createPayloadPlugin<LocationCertaintyPayload>({
    schema: LocationCertaintySchema,
  })
