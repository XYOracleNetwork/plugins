/* eslint-disable sonarjs/assertions-in-tests */
import '@xylabs/vitest-extended'

import { writeFile } from 'node:fs/promises'

import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import type { NftCollectionWitnessQuery } from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  isNftCollectionInfoWithSources,
  NftCollectionWitnessConfigSchema,
  NftCollectionWitnessQuerySchema,
} from '@xyo-network/crypto-nft-collection-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'
import { getProvidersFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import { CryptoNftCollectionWitness } from '../Witness.ts'

const validateObservation = (observation: Payload[]) => {
  const results = observation.filter(isNftCollectionInfoWithSources)
  expect(results.length).toBeGreaterThan(0)
  const collectionInfo = results[0]
  expect(collectionInfo.address).toBeString()
  expect(collectionInfo.chainId).toBeNumber()
  expect(collectionInfo.name).toBeString()
  expect(collectionInfo.type).toBeOneOf(['ERC721', 'ERC1155', null])
  expect(collectionInfo.$sources).toBeArray()
  expect(collectionInfo.$sources?.length).toBeGreaterThan(0)
}

/**
 * @group slow
 */

describe.skipIf(!process.env.INFURA_PROJECT_ID)('CryptoNftCollectionWitness', () => {
  let account: AccountInstance
  beforeAll(async () => {
    account = await Account.random()
  })
  describe('observe', () => {
    const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'
    const chainId = 1
    describe('with no address or chainId in query', () => {
      it('uses values from config', async () => {
        const witness = await CryptoNftCollectionWitness.create({
          account,
          config: {
            address, chainId, schema: NftCollectionWitnessConfigSchema,
          },
          providers: () => getProvidersFromEnv(1, chainId),
        })
        const query: NftCollectionWitnessQuery = { maxNfts: 10, schema: NftCollectionWitnessQuerySchema }
        const observation = await witness.observe([query])
        validateObservation(observation)
      })
    })
    describe('with address and chainId in query', () => {
      it('uses values from query', async () => {
        const witness = await CryptoNftCollectionWitness.create({
          account,
          config: { schema: NftCollectionWitnessConfigSchema },
          providers: () => getProvidersFromEnv(1, chainId),
        })
        const query: NftCollectionWitnessQuery = {
          address, chainId, maxNfts: 10, schema: NftCollectionWitnessQuerySchema,
        }
        const observation = await witness.observe([query])
        validateObservation(observation)
      })
    })
  })
  describe.skip('with common NFT collections', () => {
    const cases: [address: string, chainId: number][] = [
      ['0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', 1],
      ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', 1],
      ['0x60E4d786628Fea6478F785A6d7e704777c86a7c6', 1],
      ['0xED5AF388653567Af2F388E6224dC7C4b3241C544', 1],
      ['0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a', 1],
    ]
    it.each(cases)(
      'witness the collection',
      async (address, chainId) => {
        const witness = await CryptoNftCollectionWitness.create({
          account,
          config: { schema: NftCollectionWitnessConfigSchema },
          providers: () => getProvidersFromEnv(1, chainId),
        })
        const query: NftCollectionWitnessQuery = {
          address, chainId, maxNfts: 20_000, schema: NftCollectionWitnessQuerySchema,
        }
        const observation = await witness.observe([query])
        validateObservation(observation)
        await writeFile(`./nftData/witness/${address}-witness.json`, JSON.stringify(observation, null, 2))
      },
      120_000,
    )
  })
})
