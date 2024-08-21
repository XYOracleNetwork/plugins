import type { NftInfoFields, OpenSeaNftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import type { ScaledScore } from '@xyo-network/crypto-nft-score-model'
import { incrementPossible, incrementTotal, incrementTotalAndPossible, PASS } from '@xyo-network/crypto-nft-score-model'

const isHexColor = /^[\da-f]{6}$/i

export const scoreNftBackgroundColor = (nft: NftInfoFields | OpenSeaNftInfoFields): ScaledScore => {
  return scoreBackgroundColor(nft.metadata?.background_color)
}

export const scoreBackgroundColor = (background_color: unknown): ScaledScore => {
  const score: ScaledScore = [0, 0]
  if (background_color === undefined || background_color === null) return PASS
  incrementPossible(score)
  if (typeof background_color !== 'string') return score
  incrementTotalAndPossible(score)
  if (!isHexColor.test(background_color.toUpperCase())) return score
  return incrementTotal(score)
}
