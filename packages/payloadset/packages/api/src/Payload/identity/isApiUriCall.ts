import { ApiUriCall } from '../types'
import { isApiCall } from './isApiCall'

export const isApiUriCall = (value?: unknown): value is ApiUriCall => isApiCall(value) && !!(value as ApiUriCall).uri
