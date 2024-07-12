import { BowserSystemInfoPayload } from './Payload.js'
import { BowserSystemInfoSchema } from './Schema.js'

export const bowserSystemInfoPayloadTemplate = (): BowserSystemInfoPayload => ({
  schema: BowserSystemInfoSchema,
})
