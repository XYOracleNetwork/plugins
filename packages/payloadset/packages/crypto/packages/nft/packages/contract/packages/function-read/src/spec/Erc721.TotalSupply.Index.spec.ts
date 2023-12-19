import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet } from '@xyo-network/account'
import {
  CryptoContractFunctionCallSchema,
  isCryptoContractFunctionCallResult,
  isCryptoContractFunctionCallSuccess,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721Enumerable__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import { Provider } from 'ethers'

import { CryptoContractDiviner } from '../Diviner'
import { CryptoContractFunctionReadWitness } from '../Witness'
import erc721TotalSupplyIndexManifest from './Erc721.TotalSupply.Index.json'

const maxProviders = 32

describeIf(process.env.INFURA_PROJECT_ID)('Erc721.TotalSupply.Index', () => {
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' //Bored Apes
  let wallet: HDWallet
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
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDiviner, CryptoContractDiviner.labels)

    locator.register(
      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProviders(),
      }),
      { 'network.xyo.crypto.contract.interface': 'Erc721Enumerable' },
    )
    const manifest = new ManifestWrapper(erc721TotalSupplyIndexManifest as PackageManifestPayload, wallet, locator)
    node = await manifest.loadNodeFromIndex(0)
  })
  type TestData = readonly [string]
  const cases: readonly TestData[] = [
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'], // BAYC
  ] as const
  describeIf(process.env.INFURA_PROJECT_ID)('Sentinel', () => {
    describe('with matching ABI', () => {
      it.each(cases)('returns totalSupply', async (address) => {
        const sentinel = asSentinelInstance(await node.resolve('EvmContractSentinel'))
        const input = { address, chainId: 1, schema: CryptoContractFunctionCallSchema }
        const observations = await sentinel?.report([input])
        expect(observations?.length).toBe(2)
        const totalSupply = observations?.filter(isCryptoContractFunctionCallResult).find(isCryptoContractFunctionCallSuccess)
        expect(totalSupply).toBeDefined()
        expect(totalSupply?.result).toBeNumber()
      })
    })
  })
})
