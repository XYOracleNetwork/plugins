import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.ts'
import type { ApiCallXmlResult } from '../types/index.ts'

export const isApiCallXmlResult = (x?: unknown | null): x is ApiCallXmlResult => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallXmlResult)?.data === 'string'
}
