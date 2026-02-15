import type { Hash } from '@xylabs/sdk-js'
import type { Payload } from '@xyo-network/payload-model'

import type { ApiCallResultSchema } from '../Schema.ts'
import type { ApiCallJsonResult } from './ApiCallJsonResult.ts'
import type { ApiCallXmlResult } from './ApiCallXmlResult.ts'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, ApiCallJsonResult['contentType']>, ApiCallXmlResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>
