import type {
  Hash, JsonArray, JsonObject,
} from '@xylabs/sdk-js'
import { AsObjectFactory } from '@xylabs/sdk-js'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import type { ApiCallResult } from './ApiCallResult.ts'

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
  return isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)(x) && (x as ApiCallJsonResult)?.contentType === 'application/json'
}
export const asApiCallJsonResult = AsObjectFactory.create(isApiCallJsonResult)
