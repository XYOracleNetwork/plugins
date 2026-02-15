import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect,
  it,
} from 'vitest'

import { isErc721, isErc1155 } from '../tokenTypes.ts'

describe.skipIf(!process.env.INFURA_PROJECT_ID)('getNftCollectionMetadata', () => {
  it('Check ERC721', async () => {
    const provider = getProviderFromEnv(0x01)
    const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'
    const result721 = await isErc721(provider, address)
    const result1155 = await isErc1155(provider, address)
    expect(result721).toBeTrue()
    expect(result1155).toBeFalse()
  })
  it('Check ERC1155', async () => {
    const provider = getProviderFromEnv(0x01)
    const address = '0x495f947276749ce646f68ac8c248420045cb7b5e'
    const result1155 = await isErc1155(provider, address)
    expect(result1155).toBeTrue()
  })
})
