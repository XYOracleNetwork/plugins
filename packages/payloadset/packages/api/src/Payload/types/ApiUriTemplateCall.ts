import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.js'
import { ApiCallFields } from './ApiCallFields.js'

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, string>
    uriTemplate?: string
  },
  ApiCallSchema
>
