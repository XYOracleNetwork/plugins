import { AbstractModuleInstancePayload } from './Payload.js'
import { AbstractModuleInstanceSchema } from './Schema.js'

export const moduleInstancePayloadTemplate = (): Partial<AbstractModuleInstancePayload> => {
  return {
    address: undefined,
    queries: undefined,
    schema: AbstractModuleInstanceSchema,
  }
}
