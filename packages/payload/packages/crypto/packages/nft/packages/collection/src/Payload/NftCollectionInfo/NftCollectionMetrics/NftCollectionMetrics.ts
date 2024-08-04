import { NftTraitMetrics } from './NftTraitMetrics.ts'

export interface NftCollectionMetrics {
  metadata: {
    attributes: {
      [trait: string]: {
        metrics: NftTraitMetrics
        values: {
          [traitValue: string]: NftTraitMetrics
        }
      }
    }
  }
}
