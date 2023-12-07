import { Hash } from '@xylabs/hex'
import { AsObjectFactory, JsonArray, JsonObject } from '@xyo-network/object'
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

export type ApiUriTemplateCall = Payload<
  ApiCallFields & {
    params?: Record<string, unknown>
    uriTemplate?: string
  },
  ApiCallSchema
>

export type ApiCall = ApiUriCall | ApiUriTemplateCall

export const ApiCallResultSchema = 'network.xyo.api.call.result'
export type ApiCallResultSchema = typeof ApiCallResultSchema

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

export const isApiCall = isPayloadOfSchemaType(ApiCallSchema)
export const asApiCall = AsObjectFactory.create(isApiCall)

export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
export const asApiUriCall = AsObjectFactory.create(isApiUriCall)

export const isApiUriTemplateCall = (value?: unknown): value is ApiUriTemplateCall =>
  isApiCall(value) && !!((value as ApiUriTemplateCall).uriTemplate || (value as ApiUriTemplateCall).params)
export const asApiUriTemplateCall = AsObjectFactory.create(isApiUriTemplateCall)
