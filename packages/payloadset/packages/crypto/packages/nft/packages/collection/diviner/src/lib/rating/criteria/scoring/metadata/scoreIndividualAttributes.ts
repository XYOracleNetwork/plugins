import type { NftCollectionAttributeMetrics } from '@xyo-network/crypto-nft-collection-payload-plugin'
import type { Score } from '@xyo-network/crypto-nft-score-model'
import { normalize } from '@xyo-network/crypto-nft-score-model'

const maxScore = 10

export const scoreIndividualAttributes = (info: NftCollectionAttributeMetrics): Score => {
  const { attributes } = info.metrics.metadata
  const entries = Object.entries(attributes)
  if (entries.length === 0) return [0, maxScore]
  const scores = Object.entries(attributes).flatMap(([_trait, { values }]) => {
    return Object.entries(values).map<Score>(([_traitValue, metrics]) => {
      const rarity = Math.min(Math.round((1 - metrics.binomial.p) * maxScore), maxScore)
      return [rarity, maxScore]
    })
  })
  // eslint-disable-next-line unicorn/no-array-reduce
  const total = scores.reduce<Score>(([a, b], [c, d]) => [a + c, b + d], [0, 0])
  return normalize(total, maxScore)
}
