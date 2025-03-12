import type { UrlPayload } from './Payload.ts'
import { UrlSchema } from './Schema.ts'

export const urlPayloadTemplate = (): UrlPayload => ({
  schema: UrlSchema,
  url: '',
})
