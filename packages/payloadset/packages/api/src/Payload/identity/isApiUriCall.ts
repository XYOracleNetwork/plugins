import { ApiUriCall } from '../types/index.js'
import { isApiCall } from './isApiCall.js'

export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
