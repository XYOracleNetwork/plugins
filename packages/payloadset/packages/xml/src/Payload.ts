import { JsonObject } from '@xylabs/object'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, Payload } from '@xyo-network/payload-model'

import { XmlSchema } from './Schema'

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

/**
 * Identity function for determine if an object is an Xml Payload with meta
 */
export const isXmlWithMeta = isPayloadOfSchemaTypeWithMeta<Xml>(XmlSchema)
