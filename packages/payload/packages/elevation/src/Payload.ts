import { Payload } from '@xyo-network/payload-model'

import { ElevationSchema } from './Schema.ts'

export type ElevationPayload = Payload<{
  elevation?: number
  schema: ElevationSchema
}>
