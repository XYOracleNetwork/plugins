import '@xylabs/vitest-extended'

import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { JsonPathAggregateDiviner } from '@xyo-network/diviner-jsonpath-aggregate-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { RangeDiviner } from '@xyo-network/diviner-range'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { isNftIndex } from '@xyo-network/evm-nft-id-payload-plugin'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { ERC721Enumerable__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import { EvmCallDiviner } from '../../../Diviner.ts'
import type { EvmCallResult } from '../../../Payload.ts'
import { EvmCallWitness } from '../../../Witness.ts'
import nodeManifest from './Erc721.NftIndex.Index.json' assert { type: 'json' }

describe.runIf(process.env.INFURA_PROJECT_ID).skip('Erc721.NftIndex.Index', () => {
  let wallet: WalletInstance
  let node: MemoryNode

  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TimestampWitness)
    locator.register(EvmCallDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(JsonPatchDiviner)
    locator.register(JsonPathAggregateDiviner)
    locator.register(RangeDiviner)

    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.evm.interface': 'Erc721Enumerable' },
    )
    const manifest = new ManifestWrapper(nodeManifest as PackageManifestPayload, wallet, locator)
    node = await manifest.loadNodeFromIndex(0)
  })
  type TestData = readonly [string]
  const cases: readonly TestData[] = [
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'], // BAYC
  ] as const
  describe('Sentinel', () => {
    const totalSupply = 100
    describe('Sentinel', () => {
      it.each(cases)('returns NftIndexes', async (address) => {
        const sentinel = asSentinelInstance(await node.resolve('Sentinel'))
        const chainId = 1
        const input: EvmCallResult = {
          address,
          args: [],
          chainId,
          functionName: 'totalSupply',
          result: `${totalSupply}`,
          schema: 'network.xyo.evm.call.result',
        }

        const observations = (await sentinel?.report([input])) ?? []
        const nftIndexes = observations?.filter(isNftIndex)
        expect(nftIndexes?.length).toBe(totalSupply)
        for (const nftIndex of nftIndexes ?? []) {
          expect(nftIndex.address).toBe(address)
          expect(nftIndex.chainId).toBe(chainId)
          expect(nftIndex.index).toBeNumber()
        }
      })
    })
    describe('Index', () => {
      beforeAll(async () => {
        const delay = (ms: number) => {
          return new Promise(resolve => setTimeout(resolve, ms))
        }
        // Delay enough time for the diviners to index the results
        await delay(4000)
      })
      it.each(cases)('returns indexed NftIndex results', async (address) => {
        const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
        expect(diviner).toBeDefined()
        // Check we've indexed the results by sampling the first and last index
        const sampleIndexes = [0, totalSupply - 1]
        for (const index of sampleIndexes) {
          const query = {
            address, chainId: 1, index, schema: PayloadDivinerQuerySchema,
          }
          const result = await diviner?.divine([query])
          expect(result).toBeDefined()
          expect(result).toBeArrayOfSize(1)
        }
      })
    })
  })
})
