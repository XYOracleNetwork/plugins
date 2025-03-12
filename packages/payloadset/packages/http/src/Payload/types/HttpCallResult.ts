import type { JsonArray, JsonObject } from '@xylabs/object'

import type { HttpCallBase64Result } from './HttpCallBase64Result.ts'
import type { HttpCallErrorResult } from './HttpCallErrorResult.ts'
import type { HttpCallJsonResult } from './HttpCallJsonResult.ts'

type NewType = JsonObject

export type HttpCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | HttpCallBase64Result
  | HttpCallJsonResult<TJson>
  | HttpCallErrorResult
