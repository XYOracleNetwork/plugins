import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { UrlSafetyPayload } from './Payload.ts'
import { UrlSafetySchema } from './Schema.ts'

export const UrlSafetyPayloadPlugin = () =>
  createPayloadPlugin<UrlSafetyPayload>({ schema: UrlSafetySchema })
