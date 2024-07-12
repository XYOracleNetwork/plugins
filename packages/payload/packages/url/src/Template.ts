import { UrlPayload } from './Payload.js'
import { UrlSchema } from './Schema.js'

export const urlPayloadTemplate = (): UrlPayload => ({
  schema: UrlSchema,
  url: '',
})
