import { Hash } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'

export type HttpCallHtmlResult = Payload<
  {
    call: Hash
    contentType: 'text/html'
    data: string
  },
  HttpCallResultSchema
>
