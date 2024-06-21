import { AsObjectFactory } from '@xylabs/object'

import { isApiCallResult } from './isApiCallResult'

export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
