import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiUriCallPayload } from './isApiUriCall.ts'

export const asApiUriCallPayload = AsObjectFactory.create(isApiUriCallPayload)
