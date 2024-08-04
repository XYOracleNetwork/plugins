import { AsObjectFactory } from '@xylabs/object'

import { isApiCallResult } from './isApiCallResult.ts'

export const asApiCallResult = AsObjectFactory.create(isApiCallResult)
