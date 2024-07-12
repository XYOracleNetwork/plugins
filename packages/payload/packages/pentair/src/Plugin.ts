import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { PentairScreenlogicPayload } from './Payload.js'
import { PentairScreenlogicSchema } from './Schema.js'

export const PentairScreenlogicPayloadPlugin = () =>
  createPayloadPlugin<PentairScreenlogicPayload>({
    schema: PentairScreenlogicSchema,
  })
