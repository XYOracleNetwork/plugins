import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ApiCall } from './ApiCall'
import { ApiCallSchema } from './Schema'

export const isApiCall = isPayloadOfSchemaType<ApiCall>(ApiCallSchema)
