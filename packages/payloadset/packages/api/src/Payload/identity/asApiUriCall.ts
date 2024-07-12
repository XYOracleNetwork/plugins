import { AsObjectFactory } from '@xylabs/object'

import { isApiUriCall } from './isApiUriCall.js'

export const asApiUriCall = AsObjectFactory.create(isApiUriCall)
