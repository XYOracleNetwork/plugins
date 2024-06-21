import { Payload } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema'
import { ApiCallFields } from './ApiCallFields'

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
