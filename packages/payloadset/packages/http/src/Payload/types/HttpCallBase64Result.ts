import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'

import type { HttpCallResultSchema } from '../Schema.ts'
import type { HttpCallJsonResult } from './HttpCallJsonResult.ts'
import type { HttpCallXmlResult } from './HttpCallXmlResult.ts'

export type HttpCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, HttpCallJsonResult['contentType']>, HttpCallXmlResult['contentType']>
    data: string
  },
  HttpCallResultSchema
>
