import { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import { FAIL, PASS, PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'

export const scoreSupply: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!nft.supply) return FAIL
  if (typeof nft.supply !== 'string') return FAIL
  try {
    return BigInt(nft.tokenId) >= 0n && BigInt(nft.tokenId) < 2n ** 256n ? PASS : FAIL
  } catch (_error) {
    return FAIL
  }
}
