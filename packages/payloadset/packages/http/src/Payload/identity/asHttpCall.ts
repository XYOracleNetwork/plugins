import { AsObjectFactory } from '@xylabs/object'

import { isHttpCall } from './isHttpCall.ts'

export const asApiCall = AsObjectFactory.create(isHttpCall)
