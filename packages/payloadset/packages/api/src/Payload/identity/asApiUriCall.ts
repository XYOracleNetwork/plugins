import { AsObjectFactory } from '@xylabs/object'

import { isApiUriCall } from './isApiUriCall'

export const asApiUriCall = AsObjectFactory.create(isApiUriCall)
