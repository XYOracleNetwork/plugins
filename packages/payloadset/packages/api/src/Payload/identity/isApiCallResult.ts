import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import type { ApiCallResult } from '../types/index.ts'

export const isApiCallResult = isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)
