import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiUriTemplateCallPayload } from './isApiUriTemplateCall.ts'

export const asApiUriTemplateCall = AsObjectFactory.create(isApiUriTemplateCallPayload)
