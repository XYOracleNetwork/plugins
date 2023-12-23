/* eslint-disable max-statements */
import { HDWallet } from '@xyo-network/account'
import { isErc721ContractInfo, isErc1155ContractInfo } from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { JsonPathAggregateDiviner } from '@xyo-network/diviner-jsonpath-aggregate-memory'
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
import { Erc1822Witness } from '@xyo-network/erc1822-witness'
import { Erc1967Witness } from '@xyo-network/erc1967-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { MemoryArchivist } from '@xyo-network/memory-archivist'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'

import { EvmCallDiviner } from '../../../../Diviner'
import { EvmCall, EvmCallSchema } from '../../../../Payload'
import { EvmCallWitness } from '../../../../Witness'
import erc721IndexNodeManifest from './Contract.Sentinel.Erc721.Index.json'
import erc1155IndexNodeManifest from './Contract.Sentinel.Erc1155.Index.json'
import sentinelNodeManifest from './Contract.Sentinel.Node.json'

describe('Contract Node', () => {
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
    locator.register(EvmCallDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner, EvmCallDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner, EvmCallDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner, EvmCallDiviner.labels)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner, EvmCallDiviner.labels)
    locator.register(TemporalIndexingDiviner, EvmCallDiviner.labels)
    locator.register(JsonPathAggregateDiviner)
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC721__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.crypto.contract.interface': 'Erc721' },
    )
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.crypto.contract.interface': 'Erc721Enumerable' },
    )
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC1155__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.crypto.contract.interface': 'Erc1155' },
    )
    locator.register(JsonPatchDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(
      new ModuleFactory(Erc1822Witness, {
        providers: getProvidersFromEnv,
      }),
    )
    locator.register(
      new ModuleFactory(Erc1967Witness, {
        providers: getProvidersFromEnv,
      }),
    )
    const publicChildren: PackageManifestPayload[] = [
      erc721IndexNodeManifest as PackageManifestPayload,
      erc1155IndexNodeManifest as PackageManifestPayload,
    ]
    const manifest = new ManifestWrapper(sentinelNodeManifest as PackageManifestPayload, wallet, locator, publicChildren)
    node = await manifest.loadNodeFromIndex(0)
  })
  describe('Sentinel', () => {
    it.each(cases)('With %s (%s)', async (_, address) => {
      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: EvmCall = { address, schema: EvmCallSchema }
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
      const query: PayloadDivinerQueryPayload = { address, schema: PayloadDivinerQuerySchema }
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
      const query: PayloadDivinerQueryPayload = { address, schema: PayloadDivinerQuerySchema }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
