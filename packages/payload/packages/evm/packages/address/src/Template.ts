import { EvmAddress } from './Payload.js'
import { EvmAddressSchema } from './Schema.js'

export const addressPayloadTemplate = (): EvmAddress => ({
  address: '',
  chainId: 1,
  schema: EvmAddressSchema,
})
