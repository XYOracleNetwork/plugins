import { AsObjectFactory } from '@xylabs/sdk-js'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type {
  ApiCallPayload, ApiUriCallPayload, ApiUriTemplateCallPayload, MimeTypes,
} from '../Payload/index.ts'
import { ApiCallWitnessConfigSchema } from './Schema.ts'

export type ApiCallWitnessConfigBase = WitnessConfig<{
  accept?: MimeTypes
  headers?: Record<string, string | undefined>
  queries?: ApiCallPayload['queries']
  schema: ApiCallWitnessConfigSchema
  timeout?: number
  verb?: ApiCallPayload['verb']
}>

export type ApiUriCallWitnessConfig = WitnessConfig<
  ApiCallWitnessConfigBase & {
    uri: ApiUriCallPayload['uri']
  }
>

export type ApiUriTemplateCallWitnessConfig = WitnessConfig<
  ApiCallWitnessConfigBase & {
    params?: Record<string, string>
    uriTemplate: ApiUriTemplateCallPayload['uriTemplate']
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
