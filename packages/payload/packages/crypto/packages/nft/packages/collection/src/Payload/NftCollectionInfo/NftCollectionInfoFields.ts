import { NftCollectionAttributeMetrics } from './NftCollectionAttributeMetrics.js'
import { NftCollectionCount } from './NftCollectionCount.js'
import { NftCollectionMetadata } from './NftCollectionMetadata.js'

export type NftCollectionInfoFields = NftCollectionCount &
  NftCollectionMetadata &
  NftCollectionAttributeMetrics & {
    sources?: string[]
  }
