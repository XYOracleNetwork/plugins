import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpCallBase64Result } from './isHttpCallBase64Result.ts'

export const asHttpCallBase64Result = AsObjectFactory.create(isHttpCallBase64Result)
