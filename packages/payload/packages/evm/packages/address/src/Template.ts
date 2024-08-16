import type { EvmAddress } from './Payload.ts'
import { EvmAddressSchema } from './Schema.ts'

export const addressPayloadTemplate = (): EvmAddress => ({
  address: '',
  chainId: 1,
  schema: EvmAddressSchema,
})
