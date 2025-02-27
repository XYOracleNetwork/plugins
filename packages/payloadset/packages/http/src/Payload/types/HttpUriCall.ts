import { Payload } from '@xyo-network/payload-model'

import { HttpCallSchema } from '../Schema.ts'
import { HttpCallFields } from './HttpCallFields.ts'

export type HttpUriCall = Payload<
  HttpCallFields & {
    uri: string
  },
  HttpCallSchema
>
