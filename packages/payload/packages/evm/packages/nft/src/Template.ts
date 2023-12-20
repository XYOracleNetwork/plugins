import { NftId } from './Payload'
import { NftIdSchema } from './Schema'

export const addressPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
})
