import { AsObjectFactory } from '@xylabs/object'

import { isApiCall } from './isApiCall.ts'

export const asApiCall = AsObjectFactory.create(isApiCall)
