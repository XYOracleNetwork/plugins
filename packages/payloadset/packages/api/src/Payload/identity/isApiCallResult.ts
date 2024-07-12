import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { ApiCallResult } from '../types/index.js'

export const isApiCallResult = isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)
