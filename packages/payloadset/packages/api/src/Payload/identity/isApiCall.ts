import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.ts'
import { ApiCall } from '../types/index.ts'

export const isApiCall = isPayloadOfSchemaType<ApiCall>(ApiCallSchema)
