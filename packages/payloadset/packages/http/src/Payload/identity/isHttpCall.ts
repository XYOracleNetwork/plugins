import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallSchema } from '../Schema.ts'
import type { HttpCall } from '../types/index.ts'

export const isHttpCall = isPayloadOfSchemaType<HttpCall>(HttpCallSchema)
