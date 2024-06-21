import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallBase64Result } from './ApiCallBase64Result'
import { ApiCallResultSchema } from './Schema'

export const isApiCallBase64Result = (x?: unknown | null): x is ApiCallBase64Result => {
  return isPayloadOfSchemaType(ApiCallResultSchema)(x) && typeof (x as ApiCallBase64Result)?.data === 'string'
}
