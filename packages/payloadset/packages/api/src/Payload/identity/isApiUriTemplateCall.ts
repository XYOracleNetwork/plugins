import type { ApiUriTemplateCall } from '../types/index.ts'
import { isApiCall } from './isApiCall.ts'

export const isApiUriTemplateCall = (value?: unknown): value is ApiUriTemplateCall =>
  isApiCall(value) && !!((value as ApiUriTemplateCall).uriTemplate || (value as ApiUriTemplateCall).params)
