import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import type { HttpCallBase64Result, HttpCallResult } from '../types/index.ts'

export const isHttpCallBase64Result = (x?: unknown | null): x is HttpCallBase64Result => {
  return isPayloadOfSchemaType<HttpCallResult>(HttpCallResultSchema)(x) && typeof (x as HttpCallBase64Result)?.data === 'string'
}
