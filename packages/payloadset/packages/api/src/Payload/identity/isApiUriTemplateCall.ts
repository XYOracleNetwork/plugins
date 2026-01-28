import type { ApiUriTemplateCallPayload } from '../types/index.ts'
import { isApiCallPayload } from './isApiCall.ts'

export const isApiUriTemplateCallPayload = <T>(value: T): value is (ApiUriTemplateCallPayload & T) =>
  isApiCallPayload(value) && !!((value as ApiUriTemplateCallPayload).uriTemplate || (value as ApiUriTemplateCallPayload).params)
