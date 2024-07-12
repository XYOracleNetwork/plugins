import { AsObjectFactory } from '@xylabs/object'

import { isApiCall } from './isApiCall.js'

export const asApiCall = AsObjectFactory.create(isApiCall)
