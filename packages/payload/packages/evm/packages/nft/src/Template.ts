import type { NftId } from './Payload/index.ts'
import { NftIdSchema } from './Payload/index.ts'

export const nftIdPayloadTemplate = (): NftId => ({
  address: '',
  chainId: 1,
  schema: NftIdSchema,
  tokenId: '',
})
