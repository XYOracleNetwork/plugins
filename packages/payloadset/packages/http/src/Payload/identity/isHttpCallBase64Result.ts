import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import type { HttpCallBase64Result } from '../types/index.ts'

export const isHttpCallBase64Result = (x?: unknown | null): x is HttpCallBase64Result => {
  return isPayloadOfSchemaType(HttpCallResultSchema)(x) && typeof (x as HttpCallBase64Result)?.data === 'string'
}
