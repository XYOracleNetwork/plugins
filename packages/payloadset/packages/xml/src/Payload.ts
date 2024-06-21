import { EmptyObject, JsonObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { XmlSchema } from './Schema'

export type Xml = Payload<JsonObject, XmlSchema>
