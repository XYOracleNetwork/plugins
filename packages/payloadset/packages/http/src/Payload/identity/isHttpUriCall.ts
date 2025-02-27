import { HttpUriCall } from '../types/index.ts'
import { isHttpCall } from './isHttpCall.ts'

export const isHttpUriCall = (value?: unknown): value is HttpUriCall => isHttpCall(value) && !!(value as HttpUriCall).uri
