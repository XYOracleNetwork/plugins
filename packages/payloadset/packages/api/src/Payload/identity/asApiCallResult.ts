import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiCallResult } from './isApiCallResult.ts'

export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
