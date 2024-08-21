import { AsObjectFactory } from '@xylabs/object'

import { isHttpCallResult } from './isHttpCallResult.ts'

export const asHttpCallResult = AsObjectFactory.create(isHttpCallResult)
