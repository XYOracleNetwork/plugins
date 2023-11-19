import { NftInfoFields } from '@xyo-network/crypto-nft-payload-plugin'
import { FAIL, PASS, PassFailScoringFunction } from '@xyo-network/crypto-nft-score-model'
import { isAddress } from 'ethers'

export const scoreContractAddress: PassFailScoringFunction<NftInfoFields> = (nft: NftInfoFields) => {
  if (!nft.address) return FAIL
  if (typeof nft.address !== 'string') return FAIL
  if (!isAddress(nft.address)) return FAIL
  return PASS
}
