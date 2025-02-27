import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import { HttpCallResult } from '../types/index.ts'

export const isHttpCallResult = isPayloadOfSchemaType<HttpCallResult>(HttpCallResultSchema)
