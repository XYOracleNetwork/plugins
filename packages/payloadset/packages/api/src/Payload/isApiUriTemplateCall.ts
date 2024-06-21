import { ApiUriTemplateCall } from './ApiUriTemplateCall'
import { isApiCall } from './isApiCall'

export const isApiUriTemplateCall = (value?: unknown): value is ApiUriTemplateCall =>
  isApiCall(value) && !!((value as ApiUriTemplateCall).uriTemplate || (value as ApiUriTemplateCall).params)
