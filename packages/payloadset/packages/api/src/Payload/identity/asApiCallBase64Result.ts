import { AsObjectFactory } from '@xylabs/object'

import { isApiCallBase64Result } from './isApiCallBase64Result.ts'

export const asApiCallBase64Result = AsObjectFactory.create(isApiCallBase64Result)
