import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { HttpMeta } from './HttpMeta.js'

export type ApiCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  ApiCallResultSchema
>
