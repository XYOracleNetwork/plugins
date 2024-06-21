import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallResultSchema } from '../Schema'
import { ApiCallBase64Result } from '../types'

export const isApiCallBase64Result = (x?: unknown | null): x is ApiCallBase64Result => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallBase64Result)?.data === 'string'
}
