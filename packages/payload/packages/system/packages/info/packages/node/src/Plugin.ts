import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { NodeSystemInfoPayload } from './Payload.js'
import { NodeSystemInfoSchema } from './Schema.js'
import { systemInfoNodeWitnessTemplate } from './Template.js'

export const NodeSystemInfoPayloadPlugin = () =>
  createPayloadPlugin<NodeSystemInfoPayload>({
    schema: NodeSystemInfoSchema,
    template: systemInfoNodeWitnessTemplate,
  })
