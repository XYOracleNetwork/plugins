import { AsObjectFactory } from '@xylabs/object'

import { isApiUriTemplateCall } from './isApiUriTemplateCall.ts'

export const asApiUriTemplateCall = AsObjectFactory.create(isApiUriTemplateCall)
