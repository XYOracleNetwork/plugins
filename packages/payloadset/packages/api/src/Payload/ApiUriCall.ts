import { Payload } from '@xyo-network/payload-model'

import { ApiCallFields } from './ApiCallFields'
import { ApiCallSchema } from './Schema'

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
