import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResult } from './ApiCallResult'
import { ApiCallResultSchema } from './Schema'

export const isApiCallResult = isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)
