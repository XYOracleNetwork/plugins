import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import type {
  CryptoContractFunctionCall } from '@xyo-network/crypto-contract-function-read-payload-plugin'
import {
  CryptoContractFunctionCallSchema,
  isErc721ContractInfo,
  isErc1155ContractInfo,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import type { PayloadDivinerQueryPayload } from '@xyo-network/diviner-payload-model'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import type { ModuleManifest, PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import type { Provider } from 'ethers'

// eslint-disable-next-line import-x/no-deprecated
import { CryptoContractDiviner } from '../../../Diviner/index.ts'
// eslint-disable-next-line import-x/no-deprecated
import { CryptoContractFunctionReadWitness } from '../../../Witness.ts'
import erc721IndexNodeManifest from './Contract.Sentinel.Erc721.Index.json'
import erc1155IndexNodeManifest from './Contract.Sentinel.Erc1155.Index.json'
import sentinelNodeManifest from './Contract.Sentinel.Node.json'

const maxProviders = 32

describe.skip('Contract Node', () => {
  type TokenType = 'ERC721' | 'ERC1155'
  const cases: [TokenType, string][] = [
    ['ERC721', '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'],
    ['ERC1155', '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452'],
    ['ERC1155', '0x2A6d6a082C410a195157EC4caf67CB9fD718f087'],
    ['ERC1155', '0x33FD426905F149f8376e227d0C9D3340AaD17aF1'],
    ['ERC1155', '0x7DaEC605E9e2a1717326eeDFd660601e2753A057'],
    ['ERC1155', '0xCaf94eB06D4dE233c45B353723C387D3E440f3d6'],
    ['ERC1155', '0xbF42C1972877F39e102807E5E80ed2ff5D16aa5f'],
  ]
  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }
  let wallet: WalletInstance
  let node: MemoryNode
  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryArchivist)
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
        config: { abi: ERC721__factory.abi },
        providers: getProviders(),
      }),
      { 'network.xyo.evm.interface': 'Erc721' },
    )
    locator.register(

      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProviders(),
      }),
      { 'network.xyo.evm.interface': 'Erc721Enumerable' },
    )
    locator.register(

      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC1155__factory.abi },
        providers: getProviders(),
      }),
      { 'network.xyo.evm.interface': 'Erc1155' },
    )
    locator.register(JsonPatchDiviner)
    locator.register(TemporalIndexingDiviner)
    const publicChildren: ModuleManifest[] = [
      ...(erc721IndexNodeManifest as PackageManifestPayload).nodes,
      ...(erc1155IndexNodeManifest as PackageManifestPayload).nodes,
    ]
    const manifest = new ManifestWrapper(sentinelNodeManifest as PackageManifestPayload, wallet, locator, publicChildren)
    node = await manifest.loadNodeFromIndex(0)
  })
  describe('Sentinel', () => {
    it.each(cases)('With %s (%s)', async (_, address) => {
      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: CryptoContractFunctionCall = { address, schema: CryptoContractFunctionCallSchema }
      const report = await collectionSentinel?.report([collectionCallPayload])
      let foundAny = false
      const erc721 = report?.find(isErc721ContractInfo)
      if (erc721) {
        foundAny = true
        expect(erc721?.results?.name).toBe('BoredApeYachtClub')
        expect(erc721?.results?.symbol).toBe('BAYC')
      }
      const erc1155 = report?.find(isErc1155ContractInfo)
      if (erc1155) {
        foundAny = true
        expect(erc1155?.results?.uri).toBeDefined()
      }
      expect(foundAny).toBe(true)
    })
  })
  describe('ERC721 Index', () => {
    const erc721Cases = cases.filter(([type]) => type === 'ERC721')
    it.each(erc721Cases)('With %s (%s)', async (_, address) => {
      const diviner = asDivinerInstance(await node.resolve('Erc721IndexDiviner'))
      expect(diviner).toBeDefined()
      const query = { address, schema: PayloadDivinerQuerySchema } as PayloadDivinerQueryPayload
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
  describe('ERC1155 Index', () => {
    const erc1155 = cases.filter(([type]) => type === 'ERC1155')
    it.each(erc1155)('With %s (%s)', async (_, address) => {
      const diviner = asDivinerInstance(await node.resolve('Erc1155IndexDiviner'))
      expect(diviner).toBeDefined()
      const query = { address, schema: PayloadDivinerQuerySchema } as PayloadDivinerQueryPayload
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
