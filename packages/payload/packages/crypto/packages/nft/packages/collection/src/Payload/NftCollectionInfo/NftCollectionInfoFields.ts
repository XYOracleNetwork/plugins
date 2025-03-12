import type { NftCollectionAttributeMetrics } from './NftCollectionAttributeMetrics.ts'
import type { NftCollectionCount } from './NftCollectionCount.ts'
import type { NftCollectionMetadata } from './NftCollectionMetadata.ts'

export type NftCollectionInfoFields = NftCollectionCount &
  NftCollectionMetadata &
  NftCollectionAttributeMetrics
