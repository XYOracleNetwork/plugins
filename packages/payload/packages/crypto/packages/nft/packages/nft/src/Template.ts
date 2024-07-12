import { NftInfo } from './Payload/index.js'
import { NftSchema } from './Schema.js'

export const cryptoWalletNftPayloadTemplate = (): Partial<NftInfo> => ({
  schema: NftSchema,
})
