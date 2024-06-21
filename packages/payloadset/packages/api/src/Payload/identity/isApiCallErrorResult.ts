import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema'
import { ApiCallErrorResult, ApiCallResult } from '../types'

export const isApiCallErrorResult = (value: unknown): value is ApiCallErrorResult =>
  !!isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema) && ((value as ApiCallErrorResult).http?.status ?? 200) >= 400
