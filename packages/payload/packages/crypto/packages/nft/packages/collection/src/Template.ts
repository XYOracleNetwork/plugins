import { NftCollectionInfo } from './Payload/index.js'
import { NftCollectionSchema } from './Schema.js'

export const cryptoNftCollectionPayloadTemplate = (): Partial<NftCollectionInfo> => ({
  schema: NftCollectionSchema,
})
