import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.ts'
import { ApiCallFields } from './ApiCallFields.ts'

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, string>
    uriTemplate?: string
  },
  ApiCallSchema
>
