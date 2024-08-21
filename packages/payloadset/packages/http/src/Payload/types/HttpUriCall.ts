import type { Payload } from '@xyo-network/payload-model'

import type { HttpCallSchema } from '../Schema.ts'
import type { HttpCallFields } from './HttpCallFields.ts'

export type HttpUriCall = Payload<
  HttpCallFields & {
    uri: string
  },
  HttpCallSchema
>
