import type { NftCollectionInfo } from '@xyo-network/crypto-nft-collection-payload-plugin'
import type { WeightedScoringCriteria } from '@xyo-network/crypto-nft-score-model'

import { scoreMetadata, scoreTotal } from './scoring/index.ts'

export const scoringCriteria: { [key: string]: WeightedScoringCriteria<NftCollectionInfo> } = {
  ...scoreMetadata,
  Total: { score: scoreTotal, weight: 2 },
}
