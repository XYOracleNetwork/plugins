import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'

import type { HttpCallResultSchema } from '../Schema.ts'

export type HttpCallHtmlResult = Payload<
  {
    call: Hash
    contentType: 'text/html'
    data: string
  },
  HttpCallResultSchema
>
