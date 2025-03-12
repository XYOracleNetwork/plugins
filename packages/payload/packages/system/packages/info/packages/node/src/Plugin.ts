import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { NodeSystemInfoPayload } from './Payload.ts'
import { NodeSystemInfoSchema } from './Schema.ts'
import { systemInfoNodeWitnessTemplate } from './Template.ts'

export const NodeSystemInfoPayloadPlugin = () =>
  createPayloadPlugin<NodeSystemInfoPayload>({
    schema: NodeSystemInfoSchema,
    template: systemInfoNodeWitnessTemplate,
  })
