import { AsObjectFactory } from '@xylabs/sdk-js'

import { isHttpCallXmlResult } from './isHttpCallXmlResult.ts'

export const asHttpCallXmlResult = AsObjectFactory.create(isHttpCallXmlResult)
