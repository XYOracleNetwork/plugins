import type { JsonArray, JsonObject } from '@xylabs/object'

import type { ApiCallBase64Result } from './ApiCallBase64Result.ts'
import type { ApiCallErrorResult } from './ApiCallErrorResult.ts'
import type { ApiCallJsonResult } from './ApiCallJsonResult.ts'

type NewType = JsonObject

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult
