import { Payload } from '@xyo-network/payload-model'

import { HttpCallSchema } from '../Schema.ts'
import { HttpCallFields } from './HttpCallFields.ts'

export type HttpUriTemplateCall = Payload<
  HttpCallFields & {
    params?: Record<string, string>
    uriTemplate?: string
  },
  HttpCallSchema
>
