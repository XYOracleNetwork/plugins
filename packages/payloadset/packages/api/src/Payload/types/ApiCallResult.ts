import { JsonArray, JsonObject } from '@xylabs/object'

import { ApiCallBase64Result } from './ApiCallBase64Result.ts'
import { ApiCallErrorResult } from './ApiCallErrorResult.ts'
import { ApiCallJsonResult } from './ApiCallJsonResult.ts'

type NewType = JsonObject

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult
