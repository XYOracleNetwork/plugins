/* eslint-disable max-statements */
import { HDWallet } from '@xyo-network/account'
import {
  CryptoContractFunctionCall,
  CryptoContractFunctionCallSchema,
  isErc721ContractInfo,
  isErc1155ContractInfo,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import { PayloadDivinerQueryPayload, PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { EvmContractSchema, EvmContractWitness, EvmContractWitnessConfigSchema } from '@xyo-network/evm-contract-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { MemoryArchivist } from '@xyo-network/memory-archivist'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { BlockchainAddress, BlockchainAddressSchema, getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import { Provider } from 'ethers'

import sentinelNodeManifest from './Contract.Witness.Index.json'

const maxProviders = 32

describe('Contract Node', () => {
  const chainId = 1
  type TokenType = 'ERC721' | 'ERC1155'
  const cases: [TokenType, string][] = [
    ['ERC721', '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'],
    ['ERC1155', '0x2A6d6a082C410a195157EC4caf67CB9fD718f087'],
  ]
  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }
  let wallet: HDWallet
  let node: MemoryNode
  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryArchivist)
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TimestampWitness)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner, { 'network.xyo.evm.contract': 'diviner' })
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner, { 'network.xyo.evm.contract': 'diviner' })
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner, { 'network.xyo.evm.contract': 'diviner' })
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner, { 'network.xyo.evm.contract': 'diviner' })
    locator.register(TemporalIndexingDiviner, { 'network.xyo.evm.contract': 'diviner' })
    locator.register(JsonPatchDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(
      new ModuleFactory(EvmContractWitness, {
        providers: getProviders,
      }),
      { '"network.xyo.diviner.indexing.temporal.config"': 'witness' },
    )
    // const publicChildren: PackageManifestPayload[] = [
    //   erc721IndexNodeManifest as PackageManifestPayload,
    //   erc1155IndexNodeManifest as PackageManifestPayload,
    // ]
    const publicChildren: PackageManifestPayload[] = []
    const manifest = new ManifestWrapper(sentinelNodeManifest as PackageManifestPayload, wallet, locator, publicChildren)
    node = await manifest.loadNodeFromIndex(0)
  })
  describe('Sentinel', () => {
    it.each(cases)('With %s (%s)', async (_, address) => {
      const collectionSentinel = asSentinelInstance(await node.resolve('EvmContractSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: BlockchainAddress = { address, chainId, schema: BlockchainAddressSchema }
      const report = await collectionSentinel?.report([collectionCallPayload])
      expect(report).toBeDefined()
      expect(report).toBeArrayOfSize(1)
    })
  })
  describe.skip('ERC721 Index', () => {
    const erc721Cases = cases.filter(([type]) => type === 'ERC721')
    it.each(erc721Cases)('With %s (%s)', async (_, address) => {
      const diviner = asDivinerInstance(await node.resolve('Erc721IndexDiviner'))
      expect(diviner).toBeDefined()
      const query: PayloadDivinerQueryPayload = { address, schema: PayloadDivinerQuerySchema }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
  describe.skip('ERC1155 Index', () => {
    const erc1155 = cases.filter(([type]) => type === 'ERC1155')
    it.each(erc1155)('With %s (%s)', async (_, address) => {
      const diviner = asDivinerInstance(await node.resolve('Erc1155IndexDiviner'))
      expect(diviner).toBeDefined()
      const query: PayloadDivinerQueryPayload = { address, schema: PayloadDivinerQuerySchema }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
