import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { BowserSystemInfoPayload } from './Payload.js'
import { BowserSystemInfoSchema } from './Schema.js'
import { bowserSystemInfoPayloadTemplate } from './Template.js'

export const BowserSystemInfoPayloadPlugin = () =>
  createPayloadPlugin<BowserSystemInfoPayload>({
    schema: BowserSystemInfoSchema,
    template: bowserSystemInfoPayloadTemplate,
  })
