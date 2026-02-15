import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpUriCall } from './isHttpUriCall.ts'

export const asHttpUriCall = AsObjectFactory.create(isHttpUriCall)
