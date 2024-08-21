import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, Payload } from '@xyo-network/payload-model'

import { HtmlSchema } from './Schema.ts'

/**
 * The fields of an Html Payload
 */
export interface HtmlFields {
  html: string
}

/**
 * An Html Payload
 */
export type Html = Payload<HtmlFields, HtmlSchema>

/**
 * Identity function for determine if an object is an Html Payload
 */
export const isHtml = isPayloadOfSchemaType<Html>(HtmlSchema)

/**
 * Identity function for determine if an object is an Html Payload with sources
 */
export const isHtmlWithSources = isPayloadOfSchemaTypeWithSources<Html>(HtmlSchema)

/**
 * Identity function for determine if an object is an Html Payload with meta
 */
export const isHtmlWithMeta = isPayloadOfSchemaTypeWithMeta<Html>(HtmlSchema)
