import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { ElevationPayload } from './Payload.ts'
import { ElevationSchema } from './Schema.ts'
import { elevationPayloadTemplate } from './Template.ts'

export const ElevationPayloadPlugin = () =>
  createPayloadPlugin<ElevationPayload>({
    schema: ElevationSchema,
    template: elevationPayloadTemplate,
  })
