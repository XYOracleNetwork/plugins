import { AsObjectFactory } from '@xylabs/object'

import { isHttpUriCall } from './isHttpUriCall.ts'

export const asHttpUriCall = AsObjectFactory.create(isHttpUriCall)
