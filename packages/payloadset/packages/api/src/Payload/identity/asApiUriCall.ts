import { AsObjectFactory } from '@xylabs/object'

import { isApiUriCall } from './isApiUriCall.ts'

export const asApiUriCall = AsObjectFactory.create(isApiUriCall)
