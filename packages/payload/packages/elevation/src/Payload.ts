import { Payload } from '@xyo-network/payload-model'

import { ElevationSchema } from './Schema.js'

export type ElevationPayload = Payload<{
  elevation?: number
  schema: ElevationSchema
}>
