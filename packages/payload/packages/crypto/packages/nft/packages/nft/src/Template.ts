import { NftInfo } from './Payload/index.ts'
import { NftSchema } from './Schema.ts'

export const cryptoWalletNftPayloadTemplate = (): Partial<NftInfo> => ({
  schema: NftSchema,
})
