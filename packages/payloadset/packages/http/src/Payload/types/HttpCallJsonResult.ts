import type { Hash } from '@xylabs/hex'
import type { JsonArray, JsonObject } from '@xylabs/object'
import { AsObjectFactory } from '@xylabs/object'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import type { HttpCallResult } from './HttpCallResult.ts'

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
