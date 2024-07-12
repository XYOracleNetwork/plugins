import { JsonArray, JsonObject } from '@xylabs/object'

import { ApiCallBase64Result } from './ApiCallBase64Result.js'
import { ApiCallErrorResult } from './ApiCallErrorResult.js'
import { ApiCallJsonResult } from './ApiCallJsonResult.js'

type NewType = JsonObject

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult
