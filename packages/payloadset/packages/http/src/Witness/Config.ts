import { AsObjectFactory } from '@xylabs/sdk-js'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type {
  HttpCall, HttpUriCall, HttpUriTemplateCall, MimeTypes,
} from '../Payload/index.ts'
import { HttpCallWitnessConfigSchema } from './Schema.ts'

export type HttpCallWitnessConfigBase = WitnessConfig<{
  accept?: MimeTypes
  headers?: Record<string, string | undefined>
  queries?: HttpCall['queries']
  schema: HttpCallWitnessConfigSchema
  timeout?: number
  verb?: HttpCall['verb']
}>

export type HttpUriCallWitnessConfig = WitnessConfig<
  HttpCallWitnessConfigBase & {
    uri: HttpUriCall['uri']
  }
>

export type HttpUriTemplateCallWitnessConfig = WitnessConfig<
  HttpCallWitnessConfigBase & {
    params?: Record<string, string>
    uriTemplate: HttpUriTemplateCall['uriTemplate']
  }
>

export type HttpCallWitnessConfig = HttpUriCallWitnessConfig | HttpUriTemplateCallWitnessConfig | HttpCallWitnessConfigBase

export const isHttpCallWitnessConfig = isPayloadOfSchemaType<HttpCallWitnessConfig>(HttpCallWitnessConfigSchema)
export const asHttpCallWitnessConfig = AsObjectFactory.create(isHttpCallWitnessConfig)

export const isHttpUriCallWitnessConfig = (value?: unknown): value is HttpUriCallWitnessConfig =>
  isHttpCallWitnessConfig(value) && !!(value as HttpUriCallWitnessConfig).uri
export const asHttpUriCallWitnessConfig = AsObjectFactory.create(isHttpUriCallWitnessConfig)

export const isHttpUriTemplateCallWitnessConfig = (value?: unknown): value is HttpUriTemplateCallWitnessConfig =>
  isHttpCallWitnessConfig(value) && !!(value as HttpUriTemplateCallWitnessConfig).uriTemplate
export const asHttpUriTemplateCallWitnessConfig = AsObjectFactory.create(isHttpUriTemplateCallWitnessConfig)
