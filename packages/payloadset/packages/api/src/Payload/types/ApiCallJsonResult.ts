import { Hash } from '@xylabs/hex'
import { AsObjectFactory, JsonArray, JsonObject } from '@xylabs/object'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'

export type ApiCallJsonResultType = JsonArray | JsonObject

export type ApiCallJsonResult<T extends ApiCallJsonResultType = ApiCallJsonResultType> = Payload<
  {
    call: Hash
    contentType: 'application/json'
    data: T
  },
  ApiCallResultSchema
>

export const isApiCallJsonResult = <T extends ApiCallJsonResultType = ApiCallJsonResultType>(x?: unknown | null): x is ApiCallJsonResult<T> => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && (x as ApiCallJsonResult)?.contentType === 'application/json'
}
export const asApiCallJsonResult = AsObjectFactory.create(isApiCallJsonResult)
