import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'

export type HttpCallXmlResult = Payload<
  {
    call: Hash
    contentType: 'application/xml' | 'text/xml'
    data: string
  },
  HttpCallResultSchema
>
