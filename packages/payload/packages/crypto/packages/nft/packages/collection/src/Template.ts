import type { NftCollectionInfo } from './Payload/index.ts'
import { NftCollectionSchema } from './Schema.ts'

export const cryptoNftCollectionPayloadTemplate = (): Partial<NftCollectionInfo> => ({ schema: NftCollectionSchema })
