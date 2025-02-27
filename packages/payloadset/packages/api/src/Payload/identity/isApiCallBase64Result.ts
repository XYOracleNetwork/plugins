import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import { ApiCallBase64Result, ApiCallResult } from '../types/index.ts'

export const isApiCallBase64Result = (x?: unknown | null): x is ApiCallBase64Result => {
  return isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)(x) && typeof (x as ApiCallBase64Result)?.data === 'string'
}
