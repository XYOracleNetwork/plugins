import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.ts'
import type { ApiCallPayload } from '../types/index.ts'

export const isApiCallPayload = isPayloadOfSchemaType<ApiCallPayload>(ApiCallSchema)
