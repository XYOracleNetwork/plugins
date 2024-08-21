import type { Payload } from '@xyo-network/payload-model'

import { NftCollectionSchema } from '../Schema.ts'
import type { NftCollectionInfoFields } from './NftCollectionInfo/index.ts'

export type NftCollectionInfo = Payload<NftCollectionInfoFields, NftCollectionSchema>

export const isNftCollectionInfo = (payload: Payload): payload is NftCollectionInfo => {
  return payload.schema === NftCollectionSchema
}
