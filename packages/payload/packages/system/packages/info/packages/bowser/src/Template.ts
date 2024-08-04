import { BowserSystemInfoPayload } from './Payload.ts'
import { BowserSystemInfoSchema } from './Schema.ts'

export const bowserSystemInfoPayloadTemplate = (): BowserSystemInfoPayload => ({
  schema: BowserSystemInfoSchema,
})
