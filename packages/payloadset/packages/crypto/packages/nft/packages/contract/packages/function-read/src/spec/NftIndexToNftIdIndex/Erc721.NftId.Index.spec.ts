import { delay } from '@xylabs/delay'
import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet, WalletInstance } from '@xyo-network/account'
import { CryptoContractFunctionCallSchema } from '@xyo-network/crypto-contract-function-read-payload-plugin'
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
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721Enumerable__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import { Provider } from 'ethers'

// eslint-disable-next-line import/no-deprecated
import { CryptoContractDiviner } from '../../Diviner/index.ts'
// eslint-disable-next-line import/no-deprecated
import { CryptoContractFunctionReadWitness } from '../../Witness.ts'
import nodeManifest from './Erc721.NftId.Index.json'

const maxProviders = 32

describeIf(process.env.INFURA_PROJECT_ID)('Erc721.NftId.Index', () => {
  let wallet: WalletInstance
  let node: MemoryNode

  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }
  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TimestampWitness)

    locator.register(CryptoContractDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(JsonPatchDiviner)
    locator.register(JsonPathAggregateDiviner)
    locator.register(RangeDiviner)

    locator.register(
      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProviders(),
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
    const tokenIndexes = Array.from({ length: tokensToCheck }).map((_, tokenIndex) => {
      // Add one to prevent 0 index
      tokenIndex + 1
    })
    describe('Sentinel', () => {
      it.each(cases)('returns NftIndexes', async (address) => {
        const sentinel = asSentinelInstance(await node.resolve('Sentinel'))
        const chainId = 1
        const inputs = tokenIndexes.map((_, tokenIndex) => {
          return {
            address,
            args: [`0x${BigInt(tokenIndex).toString(16)}`],
            chainId,
            functionName: 'tokenByIndex',
            schema: CryptoContractFunctionCallSchema,
          }
        })
        const observations = await sentinel?.report(inputs)
        const nftId = observations?.filter(isNftId)
        expect(nftId?.length).toBe(tokensToCheck)
        for (const nftIndex of nftId ?? []) {
          expect(nftIndex.address).toBe(address)
          expect(nftIndex.chainId).toBe(chainId)
        }
      })
    })
    describe.skip('Index', () => {
      it.each(cases)('returns indexed NftIndex results', async (address) => {
        await delay(100)
        const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
        expect(diviner).toBeDefined()
        // Check we've indexed the results by sampling the first and last index
        const sampleIndexes = [0, tokensToCheck - 1]
        for (const index of sampleIndexes) {
          const query = { address, chainId: 1, index, schema: PayloadDivinerQuerySchema }
          const result = await diviner?.divine([query])
          expect(result).toBeDefined()
          expect(result).toBeArrayOfSize(1)
        }
      })
    })
  })
})
