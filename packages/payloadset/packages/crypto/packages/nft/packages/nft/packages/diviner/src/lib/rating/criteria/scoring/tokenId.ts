import { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import { FAIL, PASS, PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'

/**
 * Callers SHALL NOT assume that ID numbers have any specific pattern to them, and
 * MUST treat the ID as a "black box"
 * @param nft
 * @returns
 */
export const scoreTokenId: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!nft.tokenId) return FAIL
  if (typeof nft.tokenId !== 'string') return FAIL
  try {
    return BigInt(nft.tokenId) >= 0n && BigInt(nft.tokenId) < 2n ** 256n ? PASS : FAIL
  } catch {
    return FAIL
  }
}
