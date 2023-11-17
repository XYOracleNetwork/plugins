import { NftInfoFields, OpenSeaNftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import { incrementPossible, incrementTotal, incrementTotalAndPossible, PASS, ScaledScore } from '@xyo-network/crypto-nft-score-model'

const isHexColor = /^[0-9A-F]{6}$/i

export const scoreNftBackgroundColor = (nft: NftInfoFields | OpenSeaNftInfoFields): ScaledScore => {
  return scoreBackgroundColor(nft.metadata?.background_color)
}

export const scoreBackgroundColor = (background_color: unknown): ScaledScore => {
  const score: ScaledScore = [0, 0]
  if (background_color === undefined || background_color === null) return PASS
  incrementPossible(score)
  if (typeof background_color !== 'string') return score
  incrementTotalAndPossible(score)
  if (!background_color.toUpperCase().match(isHexColor)) return score
  return incrementTotal(score)
}
