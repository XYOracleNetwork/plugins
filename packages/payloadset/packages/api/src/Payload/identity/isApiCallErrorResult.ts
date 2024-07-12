import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { ApiCallErrorResult, ApiCallResult } from '../types/index.js'

export const isApiCallErrorResult = (value: unknown): value is ApiCallErrorResult =>
  !!isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema) && ((value as ApiCallErrorResult).http?.status ?? 200) >= 400
