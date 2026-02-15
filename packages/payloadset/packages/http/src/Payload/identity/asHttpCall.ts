import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpCall } from './isHttpCall.ts'

export const asApiCall = AsObjectFactory.create(isHttpCall)
