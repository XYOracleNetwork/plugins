import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import { HttpCallJsonResult } from './HttpCallJsonResult.ts'
import { HttpCallXmlResult } from './HttpCallXmlResult.ts'

export type HttpCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<Exclude<string, HttpCallJsonResult['contentType']>, HttpCallXmlResult['contentType']>
    data: string
  },
  HttpCallResultSchema
>
