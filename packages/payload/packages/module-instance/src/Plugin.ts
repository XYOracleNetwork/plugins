import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { AbstractModuleInstancePayload } from './Payload.js'
import { AbstractModuleInstanceSchema } from './Schema.js'
import { moduleInstancePayloadTemplate } from './Template.js'

export const ModuleInstancePayloadPlugin = () =>
  createPayloadPlugin<AbstractModuleInstancePayload>({
    schema: AbstractModuleInstanceSchema,
    template: moduleInstancePayloadTemplate,
  })
