import { ApiUriTemplateCall } from '../types/index.js'
import { isApiCall } from './isApiCall.js'

export const isApiUriTemplateCall = (value?: unknown): value is ApiUriTemplateCall =>
  isApiCall(value) && !!((value as ApiUriTemplateCall).uriTemplate || (value as ApiUriTemplateCall).params)
