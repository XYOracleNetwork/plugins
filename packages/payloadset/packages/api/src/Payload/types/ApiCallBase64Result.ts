import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema'
import { ApiCallJsonResult } from './ApiCallJsonResult'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<string, ApiCallJsonResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>
