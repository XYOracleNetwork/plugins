import type { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import type { PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'
import { FAIL, PASS } from '@xyo-network/crypto-nft-score-model'

export const scoreType: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!((nft.types?.length ?? 0) > 0)) return FAIL
  if (!Array.isArray(nft.types)) return FAIL
  const typesUpper = new Set(nft.types.map(t => t?.toUpperCase()))
  if (!typesUpper.has('ERC721') && !typesUpper.has('ERC1155')) return FAIL
  return PASS
}
