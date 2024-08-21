import { AsObjectFactory } from '@xylabs/object'

import { isHttpUriTemplateCall } from './isHttpUriTemplateCall.ts'

export const asHttpUriTemplateCall = AsObjectFactory.create(isHttpUriTemplateCall)
