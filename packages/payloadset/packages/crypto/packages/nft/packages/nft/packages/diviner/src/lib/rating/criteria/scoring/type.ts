import type { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import type { PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'
import { FAIL, PASS } from '@xyo-network/crypto-nft-score-model'

export const scoreType: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!nft.type) return FAIL
  if (typeof nft.type !== 'string') return FAIL
  const type = nft.type.toUpperCase()
  if (type !== 'ERC721' && type !== 'ERC1155') return FAIL
  return PASS
}
