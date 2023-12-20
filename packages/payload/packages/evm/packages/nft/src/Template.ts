import { NftId } from './Payload'
import { NftIdSchema } from './Schema'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
