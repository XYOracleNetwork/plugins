import { EvmAddress } from './Payload'
import { EvmAddressSchema } from './Schema'

export const addressPayloadTemplate = (): EvmAddress => ({
  address: '',
  chainId: 1,
  schema: EvmAddressSchema,
})
