import { delay } from '@xylabs/delay'
import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet } from '@xyo-network/account'
import { asArchivistInstance } from '@xyo-network/archivist-model'
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
import { isNftId } from '@xyo-network/evm-nft-id-payload-plugin'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721Enumerable__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'

import { EvmCallDiviner } from '../../../Diviner'
import { EvmCallSchema } from '../../../Payload'
import { EvmCallWitness } from '../../../Witness'
import nodeManifest from './Erc721.NftId.Index.json'

describeIf(process.env.INFURA_PROJECT_ID)('Erc721.NftId.Index', () => {
  let wallet: HDWallet
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
  describeIf(process.env.INFURA_PROJECT_ID)('Sentinel', () => {
    const tokensToCheck = 16
    const tokenIds = Array.from({ length: tokensToCheck }).map((_, tokenIndex) => tokenIndex)
    const tokenIndexes = tokenIds.map((tokenId) => tokenId)
    describe('Sentinel', () => {
      it.each(cases)('returns NftIndexes', async (address) => {
        const sentinel = asSentinelInstance(await node.resolve('Sentinel'))
        const chainId = 1
        const inputs = tokenIndexes.map((tokenIndex) => {
          return {
            address,
            args: [`0x${BigInt(tokenIndex).toString(16)}`],
            chainId,
            functionName: 'tokenByIndex',
            schema: EvmCallSchema,
          }
        })
        const observations = await sentinel?.report(inputs)
        const nftIds = observations?.filter(isNftId)
        expect(nftIds?.length).toBe(tokensToCheck)
        for (const nftId of nftIds ?? []) {
          expect(nftId.address).toBe(address)
          expect(nftId.chainId).toBe(chainId)
          expect(nftId.tokenId).toBeString()
          expect(tokenIds).toContain(Number(BigInt(nftId.tokenId)))
        }
      })
    })
    describe('Index', () => {
      it.each(cases)('returns indexed NftIndex results', async (address) => {
        await delay(1000)
        const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
        expect(diviner).toBeDefined()
        const archivist = asArchivistInstance(await node.resolve('Archivist'))
        const all = (await archivist?.all?.()) ?? []
        // Check we've indexed the results by sampling the first and last index
        const sampleIndexes = [0, tokensToCheck - 1]
        for (const tokenIndex of sampleIndexes) {
          const tokenId = `0x${BigInt(tokenIndex).toString(16)}`
          const query = { address, chainId: 1, length: 10, schema: PayloadDivinerQuerySchema, tokenId }
          const result = await diviner?.divine([query])
          expect(result).toBeDefined()
          expect(result).toBeArrayOfSize(1)
        }
      })
    })
  })
})
