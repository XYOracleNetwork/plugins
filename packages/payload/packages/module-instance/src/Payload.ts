import type { Payload } from '@xyo-network/payload-model'

import type { AbstractModuleInstanceSchema } from './Schema.ts'

export interface AbstractModuleInstanceQueryConfig {
  cost?: string
}

export type AbstractModuleInstancePayload = Payload<{
  address: string
  queries?: Record<string, AbstractModuleInstanceQueryConfig>
  schema: AbstractModuleInstanceSchema
}>
