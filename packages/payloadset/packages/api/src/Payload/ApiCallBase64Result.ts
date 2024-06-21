import { Hash } from '@xylabs/hex'
import { AsObjectFactory } from '@xylabs/object'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { ApiCallJsonResult } from './ApiCallJsonResult'
import { ApiCallResultSchema } from './Schema'

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<string, ApiCallJsonResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>

export const isApiCallBase64Result = (x?: unknown | null): x is ApiCallBase64Result => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallBase64Result)?.data === 'string'
}
export const asApiCallBase64Result = AsObjectFactory.create(isApiCallBase64Result)
