import type { HttpUriTemplateCall } from '../types/index.ts'
import { isHttpCall } from './isHttpCall.ts'

export const isHttpUriTemplateCall = (value?: unknown): value is HttpUriTemplateCall =>
  isHttpCall(value) && !!((value as HttpUriTemplateCall).uriTemplate || (value as HttpUriTemplateCall).params)
