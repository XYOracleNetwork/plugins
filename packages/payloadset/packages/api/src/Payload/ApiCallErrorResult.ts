import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { HttpMeta } from './HttpMeta'
import { ApiCallResultSchema } from './Schema'

export type ApiCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  ApiCallResultSchema
>
