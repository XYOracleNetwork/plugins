import { AsObjectFactory } from '@xylabs/object'

import { isApiCallXmlResult } from './isApiCallXmlResult.js'

export const asApiCallXmlResult = AsObjectFactory.create(isApiCallXmlResult)
