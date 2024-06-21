import { EmptyObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { XmlSchema } from './Schema'

export type Xml = Payload<EmptyObject, XmlSchema>
