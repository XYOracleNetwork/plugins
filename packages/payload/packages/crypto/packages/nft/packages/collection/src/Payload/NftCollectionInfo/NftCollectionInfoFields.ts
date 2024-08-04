import { NftCollectionAttributeMetrics } from './NftCollectionAttributeMetrics.ts'
import { NftCollectionCount } from './NftCollectionCount.ts'
import { NftCollectionMetadata } from './NftCollectionMetadata.ts'

export type NftCollectionInfoFields = NftCollectionCount &
  NftCollectionMetadata &
  NftCollectionAttributeMetrics & {
    sources?: string[]
  }
