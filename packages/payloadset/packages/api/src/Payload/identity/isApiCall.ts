import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema.js'
import { ApiCall } from '../types/index.js'

export const isApiCall = isPayloadOfSchemaType<ApiCall>(ApiCallSchema)
