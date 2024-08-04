import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import { ApiCallJsonResult } from './ApiCallJsonResult.ts'
import { ApiCallXmlResult } from './ApiCallXmlResult.ts'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, ApiCallJsonResult['contentType']>, ApiCallXmlResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>
