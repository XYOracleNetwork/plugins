import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema'
import { ApiCallFields } from './ApiCallFields'

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, string>
    uriTemplate?: string
  },
  ApiCallSchema
>
