import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpCallResult } from './isHttpCallResult.ts'

export const asHttpCallResult = AsObjectFactory.create(isHttpCallResult)
