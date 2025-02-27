import '@xylabs/vitest-extended'

import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import { NftInfo, OpenSeaNftAttribute } from '@xyo-network/crypto-nft-payload-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { calculateAllPropertiesDistribution } from '../calculateAllPropertiesDistribution.ts'

describe('calculateAllPropertiesDistribution', () => {
  test('calculates the property distribution', async () => {
    const filePath = Path.join(__dirname, 'testData.json')
    const fileContents = await readFile(filePath, 'utf8')
    const nfts = JSON.parse(fileContents) as NftInfo[]
    const attributes = nfts
      .map(nft => nft.metadata?.attributes as OpenSeaNftAttribute[])
      .map((attributes) => {
        return Object.fromEntries(attributes.map(attribute => [attribute.trait_type, attribute.value]))
      })
    const result = calculateAllPropertiesDistribution(attributes)
    expect(result).toBeObject()
  })
})
