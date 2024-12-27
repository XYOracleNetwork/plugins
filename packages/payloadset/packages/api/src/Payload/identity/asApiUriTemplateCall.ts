import { AsObjectFactory } from '@xylabs/object'

import { isApiUriTemplateCallPayload } from './isApiUriTemplateCall.ts'

export const asApiUriTemplateCall = AsObjectFactory.create(isApiUriTemplateCallPayload)
