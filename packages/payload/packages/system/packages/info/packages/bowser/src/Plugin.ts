import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { BowserSystemInfoPayload } from './Payload.ts'
import { BowserSystemInfoSchema } from './Schema.ts'
import { bowserSystemInfoPayloadTemplate } from './Template.ts'

export const BowserSystemInfoPayloadPlugin = () =>
  createPayloadPlugin<BowserSystemInfoPayload>({
    schema: BowserSystemInfoSchema,
    template: bowserSystemInfoPayloadTemplate,
  })
