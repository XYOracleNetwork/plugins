import type { Hash } from '@xylabs/sdk-js'
import type { Payload } from '@xyo-network/payload-model'

import type { ApiCallResultSchema } from '../Schema.ts'
import type { HttpMeta } from './HttpMeta.ts'

export type ApiCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  ApiCallResultSchema
>
