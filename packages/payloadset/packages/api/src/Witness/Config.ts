import { AsObjectFactory } from '@xylabs/object'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { WitnessConfig } from '@xyo-network/witness-model'

import { ApiCall, ApiUriCall, ApiUriTemplateCall } from '../Payload'

export const ApiCallWitnessConfigSchema = 'network.xyo.api.call.witness.config'
export type ApiCallWitnessConfigSchema = typeof ApiCallWitnessConfigSchema

export type ApiCallWitnessConfigBase = WitnessConfig<{
  accept?: 'application/json'
  headers?: Record<string, string | undefined>
  queries?: ApiCall['queries']
  schema: ApiCallWitnessConfigSchema
  timeout?: number
  verb?: ApiCall['verb']
}>

export type ApiUriCallWitnessConfig = WitnessConfig<
  ApiCallWitnessConfigBase & {
    uri: ApiUriCall['uri']
  }
>

export type ApiUriTemplateCallWitnessConfig = WitnessConfig<
  ApiCallWitnessConfigBase & {
    params?: Record<string, string>
    uriTemplate: ApiUriTemplateCall['uriTemplate']
  }
>

export type ApiCallWitnessConfig = ApiUriCallWitnessConfig | ApiUriTemplateCallWitnessConfig | ApiCallWitnessConfigBase

export const isApiCallWitnessConfig = isPayloadOfSchemaType<ApiCallWitnessConfig>(ApiCallWitnessConfigSchema)
export const asApiCallWitnessConfig = AsObjectFactory.create(isApiCallWitnessConfig)

export const isApiUriCallWitnessConfig = (value?: unknown): value is ApiUriCallWitnessConfig =>
  isApiCallWitnessConfig(value) && !!(value as ApiUriCallWitnessConfig).uri
export const asApiUriCallWitnessConfig = AsObjectFactory.create(isApiUriCallWitnessConfig)

export const isApiUriTemplateCallWitnessConfig = (value?: unknown): value is ApiUriTemplateCallWitnessConfig =>
  isApiCallWitnessConfig(value) && !!(value as ApiUriTemplateCallWitnessConfig).uriTemplate
export const asApiUriTemplateCallWitnessConfig = AsObjectFactory.create(isApiUriTemplateCallWitnessConfig)
