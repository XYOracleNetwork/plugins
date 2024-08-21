import { AsObjectFactory } from '@xylabs/object'

import { isHttpCallXmlResult } from './isHttpCallXmlResult.ts'

export const asHttpCallXmlResult = AsObjectFactory.create(isHttpCallXmlResult)
