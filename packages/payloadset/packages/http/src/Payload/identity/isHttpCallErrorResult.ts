import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { HttpCallResultSchema } from '../Schema.ts'
import { HttpCallErrorResult, HttpCallResult } from '../types/index.ts'

export const isHttpCallErrorResult = (value: unknown): value is HttpCallErrorResult =>
  !!isPayloadOfSchemaType<HttpCallResult>(HttpCallResultSchema) && ((value as HttpCallErrorResult).http?.status ?? 200) >= 400
