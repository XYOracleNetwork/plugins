import type { HttpUriCall } from './HttpUriCall.ts'
import type { HttpUriTemplateCall } from './HttpUriTemplateCall.ts'

export type HttpCall = HttpUriCall | HttpUriTemplateCall
