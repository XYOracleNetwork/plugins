import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { UrlSchema } from './Schema.ts'

export type UrlPayload = Payload<{
  schema: UrlSchema
  url: string
}>

export const isUrlPayload = isPayloadOfSchemaType<UrlPayload>(UrlSchema)
