import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema'
import { ApiCallJsonResult } from './ApiCallJsonResult'
import { ApiCallXmlResult } from './ApiCallXmlResult'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, ApiCallJsonResult['contentType']>, ApiCallXmlResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>
