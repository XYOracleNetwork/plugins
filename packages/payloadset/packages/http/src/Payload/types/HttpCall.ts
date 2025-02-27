import { HttpUriCall } from './HttpUriCall.ts'
import { HttpUriTemplateCall } from './HttpUriTemplateCall.ts'

export type HttpCall = HttpUriCall | HttpUriTemplateCall
