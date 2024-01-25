import { Hash } from '@xylabs/hex'
import { AsObjectFactory, JsonArray, JsonObject } from '@xylabs/object'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

export const ApiCallSchema = 'network.xyo.api.call'
export type ApiCallSchema = typeof ApiCallSchema

export type Verb = 'get' | 'post'
export type Queries = Record<string, string>

export interface ApiCallFields {
  queries?: Queries
  verb?: Verb
}

export type ApiUriCall = Payload<
  ApiCallFields & {
    uri: string
  },
  ApiCallSchema
>
export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
export const asApiUriCall = AsObjectFactory.create(isApiUriCall)

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, unknown>
    uriTemplate?: string
  },
  ApiCallSchema
>
export const isApiUriTemplateCall = (value?: unknown): value is ApiUriTemplateCall =>
  isApiCall(value) && !!((value as ApiUriTemplateCall).uriTemplate || (value as ApiUriTemplateCall).params)
export const asApiUriTemplateCall = AsObjectFactory.create(isApiUriTemplateCall)

export type ApiCall = ApiUriCall | ApiUriTemplateCall

export const ApiCallResultSchema = 'network.xyo.api.call.result'
export type ApiCallResultSchema = typeof ApiCallResultSchema

export const isApiCall = isPayloadOfSchemaType<ApiCall>(ApiCallSchema)
export const asApiCall = AsObjectFactory.create(isApiCall)

export interface HttpMeta {
  code?: string
  status?: number
}

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
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && (x as ApiCallJsonResult)?.contentType === 'application/json'
}
export const asApiCallJsonResult = AsObjectFactory.create(isApiCallJsonResult)

export type ApiCallBase64Result = Payload<
  {
    call: Hash
    contentType: Exclude<string, ApiCallJsonResult['contentType']>
    data: string
  },
  ApiCallResultSchema
>

export type ApiCallErrorResult = Payload<
  {
    call: Hash
    http?: HttpMeta
  },
  ApiCallResultSchema
>

export type ApiCallResult<TJson extends JsonArray | JsonObject = JsonArray | JsonObject> =
  | ApiCallBase64Result
  | ApiCallJsonResult<TJson>
  | ApiCallErrorResult

export const isApiCallResult = isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)
export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
