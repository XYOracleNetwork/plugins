import { Hash } from '@xylabs/hex'
import {
  AsObjectFactory, JsonArray, JsonObject,
} from '@xylabs/object'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import { HttpCallResult } from './HttpCallResult.ts'

export type HttpCallJsonResultType = JsonArray | JsonObject

export type HttpCallJsonResult<T extends HttpCallJsonResultType = HttpCallJsonResultType> = Payload<
  {
    call: Hash
    contentType: 'application/json'
    data: T
  },
  HttpCallResultSchema
>

export const isHttpCallJsonResult = <T extends HttpCallJsonResultType = HttpCallJsonResultType>(x?: unknown | null): x is HttpCallJsonResult<T> => {
  return isPayloadOfSchemaType<HttpCallResult>(HttpCallResultSchema)(x) && (x as HttpCallJsonResult)?.contentType === 'application/json'
}
export const asHttpCallJsonResult = AsObjectFactory.create(isHttpCallJsonResult)
