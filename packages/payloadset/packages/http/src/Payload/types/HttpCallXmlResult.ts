import type { Hash } from '@xylabs/sdk-js'
import type { Payload } from '@xyo-network/payload-model'

import type { HttpCallResultSchema } from '../Schema.ts'

export type HttpCallXmlResult = Payload<
  {
    call: Hash
    contentType: 'application/xml' | 'text/xml'
    data: string
  },
  HttpCallResultSchema
>
