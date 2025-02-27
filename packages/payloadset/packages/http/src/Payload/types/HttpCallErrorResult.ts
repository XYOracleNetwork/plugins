import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import { HttpMeta } from './HttpMeta.ts'

export type HttpCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  HttpCallResultSchema
>
