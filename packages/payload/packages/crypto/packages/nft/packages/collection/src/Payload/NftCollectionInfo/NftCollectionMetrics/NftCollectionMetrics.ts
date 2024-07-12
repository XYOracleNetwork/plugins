import { NftTraitMetrics } from './NftTraitMetrics.js'

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
