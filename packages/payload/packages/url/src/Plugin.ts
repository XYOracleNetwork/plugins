import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { UrlPayload } from './Payload.ts'
import { UrlSchema } from './Schema.ts'
import { urlPayloadTemplate } from './Template.ts'

export const UrlPayloadPlugin = () =>
  createPayloadPlugin<UrlPayload>({
    schema: UrlSchema,
    template: urlPayloadTemplate,
  })
