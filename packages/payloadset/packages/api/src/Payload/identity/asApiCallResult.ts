import { AsObjectFactory } from '@xylabs/object'

import { isApiCallResult } from './isApiCallResult.js'

export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
