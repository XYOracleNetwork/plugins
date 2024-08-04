import { AsObjectFactory } from '@xylabs/object'

import { isApiCallXmlResult } from './isApiCallXmlResult.ts'

export const asApiCallXmlResult = AsObjectFactory.create(isApiCallXmlResult)
