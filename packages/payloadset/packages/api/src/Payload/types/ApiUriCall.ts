import type { Payload } from '@xyo-network/payload-model'

import type { ApiCallSchema } from '../Schema.ts'
import type { ApiCallFields } from './ApiCallFields.ts'

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
