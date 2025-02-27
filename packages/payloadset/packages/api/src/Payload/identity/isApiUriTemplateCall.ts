import { ApiUriTemplateCallPayload } from '../types/index.ts'
import { isApiCallPayload } from './isApiCall.ts'

export const isApiUriTemplateCallPayload = (value?: unknown): value is ApiUriTemplateCallPayload =>
  isApiCallPayload(value) && !!((value as ApiUriTemplateCallPayload).uriTemplate || (value as ApiUriTemplateCallPayload).params)
