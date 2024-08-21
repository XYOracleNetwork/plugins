import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'

import type { HttpCallResultSchema } from '../Schema.ts'
import type { HttpMeta } from './HttpMeta.ts'

export type HttpCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  HttpCallResultSchema
>
