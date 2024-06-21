import { ApiUriCall } from './ApiUriCall'
import { isApiCall } from './isApiCall'

export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
