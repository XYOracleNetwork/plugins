import { JsonArray, JsonObject } from '@xylabs/object'

import { ApiCallBase64Result } from './ApiCallBase64Result'
import { ApiCallErrorResult } from './ApiCallErrorResult'
import { ApiCallJsonResult } from './ApiCallJsonResult'

type NewType = JsonObject

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | NewType> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult
