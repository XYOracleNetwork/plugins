import { NftId, NftIdSchema } from './Payload/index.ts'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
