import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { AbstractModuleInstancePayload } from './Payload.ts'
import { AbstractModuleInstanceSchema } from './Schema.ts'
import { moduleInstancePayloadTemplate } from './Template.ts'

export const ModuleInstancePayloadPlugin = () =>
  createPayloadPlugin<AbstractModuleInstancePayload>({
    schema: AbstractModuleInstanceSchema,
    template: moduleInstancePayloadTemplate,
  })
