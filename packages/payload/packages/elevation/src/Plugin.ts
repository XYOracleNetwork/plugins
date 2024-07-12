import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { ElevationPayload } from './Payload.js'
import { ElevationSchema } from './Schema.js'
import { elevationPayloadTemplate } from './Template.js'

export const ElevationPayloadPlugin = () =>
  createPayloadPlugin<ElevationPayload>({
    schema: ElevationSchema,
    template: elevationPayloadTemplate,
  })
