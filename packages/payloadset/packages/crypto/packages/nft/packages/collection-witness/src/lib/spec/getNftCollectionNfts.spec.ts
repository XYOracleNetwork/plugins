import '@xylabs/vitest-extended'

import type { EthAddress } from '@xylabs/sdk-js'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, it,
} from 'vitest'

import { getNftCollectionNfts } from '../getNftCollectionNfts.ts'

describe.skipIf(!process.env.INFURA_PROJECT_ID)('getNftCollectionNfts', () => {
  const cases: [address: EthAddress, chainId: number][] = [
    // ['0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', 1], //CryptoPunks - Need special handling
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' as EthAddress, 1],
    ['0x60E4d786628Fea6478F785A6d7e704777c86a7c6' as EthAddress, 1],
    ['0xED5AF388653567Af2F388E6224dC7C4b3241C544' as EthAddress, 1],
    ['0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a' as EthAddress, 1],
  ]

  it.each(cases)('gets NFTs owned by the address', async (address, chainId) => {
    const provider = getProviderFromEnv(chainId)
    const result = await getNftCollectionNfts(address, provider, undefined, 5)
    expect(result).toBeArray()
    expect(result.at(0)).toBeObject()
  })
})
