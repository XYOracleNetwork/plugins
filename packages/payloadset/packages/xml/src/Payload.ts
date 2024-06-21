import { JsonObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { XmlSchema } from './Schema'

export interface XmlFields {
  xml: JsonObject
}

export type Xml = Payload<XmlFields, XmlSchema>
