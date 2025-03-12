import '@xylabs/vitest-extended'

import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import type { NftCollectionInfo } from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { scoreIndividualAttributes } from '../scoreIndividualAttributes.ts'

describe('scoreIndividualAttributes', () => {
  let collections: NftCollectionInfo[]
  beforeAll(async () => {
    const filePath = Path.join(__dirname, '../../../../spec', 'testData.json')
    const fileContents = await readFile(filePath, 'utf8')
    collections = JSON.parse(fileContents) as NftCollectionInfo[]
  })
  it('evaluates the NFT collection', () => {
    for (let collection of collections) {
      const score = scoreIndividualAttributes(collection)
      const [total, possible] = score
      expect(total).toBeNumber()
      expect(total).not.toBeNegative()
      expect(possible).toBeNumber()
      expect(possible).not.toBeNegative()
      expect(total).toBeLessThanOrEqual(possible)
    }
  })
})
