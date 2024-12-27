import type { Payload } from '@xyo-network/payload-model'

import type { ApiCallSchema } from '../Schema.ts'
import type { ApiCallFields } from './ApiCallFields.ts'

export type ApiUriCallPayload = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
