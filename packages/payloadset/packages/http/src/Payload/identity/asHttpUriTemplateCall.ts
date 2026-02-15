import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpUriTemplateCall } from './isHttpUriTemplateCall.ts'

export const asHttpUriTemplateCall = AsObjectFactory.create(isHttpUriTemplateCall)
