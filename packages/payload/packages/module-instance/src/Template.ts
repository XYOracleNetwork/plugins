import { AbstractModuleInstancePayload } from './Payload.ts'
import { AbstractModuleInstanceSchema } from './Schema.ts'

export const moduleInstancePayloadTemplate = (): Partial<AbstractModuleInstancePayload> => {
  return {
    address: undefined,
    queries: undefined,
    schema: AbstractModuleInstanceSchema,
  }
}
