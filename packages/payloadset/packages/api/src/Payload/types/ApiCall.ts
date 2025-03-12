import type { ApiUriCallPayload } from './ApiUriCall.ts'
import type { ApiUriTemplateCallPayload } from './ApiUriTemplateCall.ts'

export type ApiCallPayload = ApiUriCallPayload | ApiUriTemplateCallPayload
