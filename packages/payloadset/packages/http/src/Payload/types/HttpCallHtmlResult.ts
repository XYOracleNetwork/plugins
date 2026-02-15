import type { Hash } from '@xylabs/sdk-js'
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
