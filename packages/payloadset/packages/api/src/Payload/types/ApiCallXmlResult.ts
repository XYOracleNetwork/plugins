import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'

import type { ApiCallResultSchema } from '../Schema.ts'

export type ApiCallXmlResult = Payload<
  {
    call: Hash
    contentType: 'application/xml' | 'text/xml'
    data: string
  },
  ApiCallResultSchema
>
