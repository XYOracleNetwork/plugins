import { AsObjectFactory } from '@xylabs/object'

import { isApiCall } from './isApiCall'

export const asApiCall = AsObjectFactory.create(isApiCall)
