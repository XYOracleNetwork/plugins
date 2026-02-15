import { AsObjectFactory } from '@xylabs/sdk-js'

import { isApiCallXmlResult } from './isApiCallXmlResult.ts'

export const asApiCallXmlResult = AsObjectFactory.create(isApiCallXmlResult)
