import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'

export type ApiCallXmlResult = Payload<
  {
    call: Hash
    contentType: 'application/xml' | 'text/xml'
    data: string
  },
  ApiCallResultSchema
>
