import { AsObjectFactory } from '@xylabs/object'

import { isApiCallXmlResult } from './isApiCallXmlResult'

export const asApiCallXmlResult = AsObjectFactory.create(isApiCallXmlResult)
