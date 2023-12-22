import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { NftInfo } from '@xyo-network/crypto-nft-payload-plugin'

import { getNftCollectionMetrics } from '../getNftCollectionMetrics'

describe('getNftCollectionMetrics', () => {
  test('gets NFTs collection metrics', async () => {
    const filePath = join(__dirname, '..', 'lib', 'spec', 'testData.json')
    const fileContents = await readFile(filePath, 'utf8')
    const nfts = JSON.parse(fileContents) as NftInfo[]
    const result = getNftCollectionMetrics(nfts)
    expect(result).toBeObject()
    expect(result?.metadata).toBeObject()
    expect(result?.metadata?.attributes).toBeObject()
  })
})
