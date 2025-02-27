import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.ts'
import { ApiCallFields } from './ApiCallFields.ts'

export type ApiUriCallPayload = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
