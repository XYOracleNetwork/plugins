import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { Account } from '@xyo-network/account'
import { isNftInfo, NftInfo } from '@xyo-network/crypto-nft-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { isNftScore, NftScoreDiviner } from '../Diviner'

describe('NftScoreDiviner', () => {
  let data: NftInfo[]
  beforeAll(async () => {
    const filePath = join(__dirname, 'testData.json')
    const fileContents = await readFile(filePath, 'utf8')
    const nfts = JSON.parse(fileContents)
    expect(nfts).toBeArray()
    if (Array.isArray(nfts)) {
      data = nfts.filter(isNftInfo)
    }
  })
  test('divine', async () => {
    const diviner = await NftScoreDiviner.create({ account: Account.randomSync() })
    const scores = (await diviner.divine(data)).filter(isNftScore)
    expect(scores).toBeArrayOfSize(data.length)
    for (const [i, score] of scores.entries()) {
      const wrapped = await PayloadWrapper.wrap(score)
      expect(await wrapped.getValid()).toBe(true)
      const payload = wrapped.payload()
      expect(payload?.sources).toBeArrayOfSize(1)
      expect(payload?.sources?.[0]).toBeString()
      const sourceHash = await (await PayloadWrapper.wrap(data[i])).dataHash()
      expect(payload?.sources?.[0]).toBe(sourceHash)
    }
  })
})
