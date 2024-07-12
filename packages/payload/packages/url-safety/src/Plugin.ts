import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { UrlSafetyPayload } from './Payload.js'
import { UrlSafetySchema } from './Schema.js'

export const UrlSafetyPayloadPlugin = () =>
  createPayloadPlugin<UrlSafetyPayload>({
    schema: UrlSafetySchema,
  })
