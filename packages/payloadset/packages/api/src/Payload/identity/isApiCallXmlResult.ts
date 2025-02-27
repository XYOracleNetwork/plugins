import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import { ApiCallResult, ApiCallXmlResult } from '../types/index.ts'

export const isApiCallXmlResult = (x?: unknown | null): x is ApiCallXmlResult => {
  return isPayloadOfSchemaType<ApiCallResult>(ApiCallResultSchema)(x) && typeof (x as ApiCallXmlResult)?.data === 'string'
}
