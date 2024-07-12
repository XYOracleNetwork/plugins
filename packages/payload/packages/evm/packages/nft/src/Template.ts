import { NftId, NftIdSchema } from './Payload/index.js'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
