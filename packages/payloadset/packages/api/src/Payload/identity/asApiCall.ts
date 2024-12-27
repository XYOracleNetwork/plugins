import { AsObjectFactory } from '@xylabs/object'

import { isApiCallPayload } from './isApiCall.ts'

export const asApiCallPayload = AsObjectFactory.create(isApiCallPayload)
