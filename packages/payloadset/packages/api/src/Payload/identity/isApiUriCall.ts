import { ApiUriCall } from '../types/index.ts'
import { isApiCall } from './isApiCall.ts'

export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
