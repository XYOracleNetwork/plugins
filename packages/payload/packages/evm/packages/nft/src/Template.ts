import { NftId } from './Payload/Id/Payload'
import { NftIdSchema } from './Payload/Id/Schema'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
