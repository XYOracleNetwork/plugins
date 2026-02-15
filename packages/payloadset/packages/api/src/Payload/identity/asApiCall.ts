import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiCallPayload } from './isApiCall.ts'

export const asApiCallPayload = AsObjectFactory.create(isApiCallPayload)
