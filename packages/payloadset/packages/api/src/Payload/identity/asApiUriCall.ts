import { AsObjectFactory } from '@xylabs/object'

import { isApiUriCallPayload } from './isApiUriCall.ts'

export const asApiUriCallPayload = AsObjectFactory.create(isApiUriCallPayload)
