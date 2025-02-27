import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import { HttpMeta } from './HttpMeta.ts'

export type ApiCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  ApiCallResultSchema
>
