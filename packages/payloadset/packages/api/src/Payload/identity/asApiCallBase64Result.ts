import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiCallBase64Result } from './isApiCallBase64Result.ts'

export const asApiCallBase64Result = AsObjectFactory.create(isApiCallBase64Result)
