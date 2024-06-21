import { AsObjectFactory, JsonArray, JsonObject } from '@xylabs/object'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallBase64Result } from './ApiCallBase64Result'
import { ApiCallErrorResult } from './ApiCallErrorResult'
import { ApiCallJsonResult } from './ApiCallJsonResult'
import { ApiCallResultSchema } from './Schema'

type NewType = JsonObject

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult

export const isApiCallResult = isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)
export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
