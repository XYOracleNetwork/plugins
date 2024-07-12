import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { ApiCallXmlResult } from '../types/index.js'

export const isApiCallXmlResult = (x?: unknown | null): x is ApiCallXmlResult => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallXmlResult)?.data === 'string'
}
