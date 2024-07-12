import { Payload } from '@xyo-network/payload-model'

import { NftCollectionSchema } from '../Schema.js'
import { NftCollectionInfoFields } from './NftCollectionInfo/index.js'

export type NftCollectionInfo = Payload<NftCollectionInfoFields, NftCollectionSchema>

export const isNftCollectionInfo = (payload: Payload): payload is NftCollectionInfo => {
  return payload.schema === NftCollectionSchema
}
