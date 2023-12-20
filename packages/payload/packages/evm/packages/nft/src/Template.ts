import { NftId, NftIdSchema } from './Payload'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
