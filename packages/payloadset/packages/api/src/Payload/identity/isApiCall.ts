import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCallSchema } from '../Schema'
import { ApiCall } from '../types'

export const isApiCall = isPayloadOfSchemaType<ApiCall>(ApiCallSchema)
