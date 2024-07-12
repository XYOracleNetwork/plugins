import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { UrlPayload } from './Payload.js'
import { UrlSchema } from './Schema.js'
import { urlPayloadTemplate } from './Template.js'

export const UrlPayloadPlugin = () =>
  createPayloadPlugin<UrlPayload>({
    schema: UrlSchema,
    template: urlPayloadTemplate,
  })
