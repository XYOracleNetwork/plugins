import { Payload, WithSources } from '@xyo-network/payload-model'

import { NftCollectionSchema } from '../Schema.ts'
import { NftCollectionInfoFields } from './NftCollectionInfo/index.ts'

export type NftCollectionInfo = Payload<NftCollectionInfoFields, NftCollectionSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNftCollectionInfo = (payload: any): payload is NftCollectionInfo => {
  return payload.schema === NftCollectionSchema
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNftCollectionInfoWithSources = (payload: any): payload is WithSources<NftCollectionInfo> => {
  return payload.schema === NftCollectionSchema && payload.$sources !== undefined
}
