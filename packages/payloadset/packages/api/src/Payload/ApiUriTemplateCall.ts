import { Payload } from '@xyo-network/payload-model'

import { ApiCallFields } from './ApiCallFields'
import { ApiCallSchema } from './Schema'

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, string>
    uriTemplate?: string
  },
  ApiCallSchema
>
