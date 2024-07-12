import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { ApiCallJsonResult } from './ApiCallJsonResult.js'
import { ApiCallXmlResult } from './ApiCallXmlResult.js'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, ApiCallJsonResult['contentType']>, ApiCallXmlResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>
