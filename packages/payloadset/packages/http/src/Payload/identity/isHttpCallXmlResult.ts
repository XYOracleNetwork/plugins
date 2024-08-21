import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import type { HttpCallXmlResult } from '../types/index.ts'

export const isHttpCallXmlResult = (x?: unknown | null): x is HttpCallXmlResult => {
  return isPayloadOfSchemaType(HttpCallResultSchema)(x) && typeof (x as HttpCallXmlResult)?.data === 'string'
}
