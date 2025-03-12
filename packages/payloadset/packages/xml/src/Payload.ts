import type { JsonObject } from '@xylabs/object'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import { XmlSchema } from './Schema.ts'

/**
 * The fields of an Xml Payload
 */
export interface XmlFields {
  xml: JsonObject
}

/**
 * An Xml Payload
 */
export type Xml = Payload<XmlFields, XmlSchema>

/**
 * Identity function for determine if an object is an Xml Payload
 */
export const isXml = isPayloadOfSchemaType<Xml>(XmlSchema)

/**
 * Identity function for determine if an object is an Xml Payload with sources
 */
export const isXmlWithSources = isPayloadOfSchemaTypeWithSources<Xml>(XmlSchema)
