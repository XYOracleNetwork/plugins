import type { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import type { PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'
import { FAIL, PASS } from '@xyo-network/crypto-nft-score-model'
import { isAddress } from 'ethers'

export const scoreContractAddress: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!nft.address) return FAIL
  if (typeof nft.address !== 'string') return FAIL
  if (!isAddress(nft.address)) return FAIL
  return PASS
}
