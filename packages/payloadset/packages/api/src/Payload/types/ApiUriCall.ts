import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.js'
import { ApiCallFields } from './ApiCallFields.js'

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
