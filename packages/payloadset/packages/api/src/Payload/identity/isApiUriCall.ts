import type { ApiUriCallPayload } from '../types/index.ts'
import { isApiCallPayload } from './isApiCall.ts'

export const isApiUriCallPayload = (value?: unknown): value is ApiUriCallPayload => isApiCallPayload(value) && !!(value as ApiUriCallPayload).uri
