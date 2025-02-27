import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { PentairScreenlogicPayload } from './Payload.ts'
import { PentairScreenlogicSchema } from './Schema.ts'

export const PentairScreenlogicPayloadPlugin = () =>
  createPayloadPlugin<PentairScreenlogicPayload>({ schema: PentairScreenlogicSchema })
