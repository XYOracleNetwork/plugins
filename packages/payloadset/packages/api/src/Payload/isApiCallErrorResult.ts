import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallErrorResult } from './ApiCallErrorResult'
import { ApiCallResult } from './ApiCallResult'
import { ApiCallResultSchema } from './Schema'

export const isApiCallErrorResult = (value: unknown): value is ApiCallErrorResult =>
  !!isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema) && ((value as ApiCallErrorResult).http?.status ?? 200) >= 400
