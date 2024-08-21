import { AsObjectFactory } from '@xylabs/object'

import { isHttpCallBase64Result } from './isHttpCallBase64Result.ts'

export const asHttpCallBase64Result = AsObjectFactory.create(isHttpCallBase64Result)
