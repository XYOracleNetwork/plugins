import { ApiUriCallPayload } from './ApiUriCall.ts'
import { ApiUriTemplateCallPayload } from './ApiUriTemplateCall.ts'

export type ApiCallPayload = ApiUriCallPayload | ApiUriTemplateCallPayload
