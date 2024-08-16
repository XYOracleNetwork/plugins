import type { Payload } from '@xyo-network/payload-model'

import type { NodeSystemInfoSchema } from './Schema.ts'

export type NodeSystemInfoPayload = Payload<{
  schema: NodeSystemInfoSchema
  systeminfo?: Record<string, unknown>
}>
