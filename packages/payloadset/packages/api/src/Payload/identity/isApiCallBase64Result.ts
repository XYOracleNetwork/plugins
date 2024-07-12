import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema.js'
import { ApiCallBase64Result } from '../types/index.js'

export const isApiCallBase64Result = (x?: unknown | null): x is ApiCallBase64Result => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallBase64Result)?.data === 'string'
}
