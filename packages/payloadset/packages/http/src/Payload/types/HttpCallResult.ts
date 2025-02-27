import { JsonArray, JsonObject } from '@xylabs/object'

import { HttpCallBase64Result } from './HttpCallBase64Result.ts'
import { HttpCallErrorResult } from './HttpCallErrorResult.ts'
import { HttpCallJsonResult } from './HttpCallJsonResult.ts'

type NewType = JsonObject

export type HttpCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | HttpCallBase64Result
  | HttpCallJsonResult<TJson>
  | HttpCallErrorResult
