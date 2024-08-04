import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.ts'
import { ApiCallFields } from './ApiCallFields.ts'

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
