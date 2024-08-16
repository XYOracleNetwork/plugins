import type { Payload } from '@xyo-network/payload-model'

import type { ElevationSchema } from './Schema.ts'

export type ElevationPayload = Payload<{
  elevation?: number
  schema: ElevationSchema
}>
