/* eslint-disable max-statements */
import type { Address } from '@xylabs/hex'
import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { isErc721ContractInfo, isErc1155ContractInfo } from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { JsonPathAggregateDiviner } from '@xyo-network/diviner-jsonpath-aggregate-memory'
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
import { Erc1822Witness } from '@xyo-network/erc1822-witness'
import { Erc1967Witness } from '@xyo-network/erc1967-witness'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import {
  ModuleFactory, resolveLocalNameToAddress, resolveLocalNameToInstance, resolvePathToAddress,
} from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import {
  ERC721__factory, ERC721Enumerable__factory, ERC1155__factory,
} from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'

import { EvmCallDiviner } from '../../../../Diviner.ts'
import type { EvmCall } from '../../../../Payload.ts'
import { EvmCallSchema } from '../../../../Payload.ts'
import { EvmCallWitness } from '../../../../Witness.ts'
import erc721IndexNodeManifest from './Contract.Sentinel.Erc721.Index.json'
import erc1155IndexNodeManifest from './Contract.Sentinel.Erc1155.Index.json'
import sentinelNodeManifest from './Contract.Sentinel.Node.json'

describe('Contract Node', () => {
  type TokenType = 'ERC721' | 'ERC1155'
  const cases: [TokenType, string][] = [
    ['ERC721', '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'.toLowerCase()],
    ['ERC1155', '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452'.toLowerCase()],
    ['ERC1155', '0x2A6d6a082C410a195157EC4caf67CB9fD718f087'.toLowerCase()],
    ['ERC1155', '0x33FD426905F149f8376e227d0C9D3340AaD17aF1'.toLowerCase()],
    ['ERC1155', '0x7DaEC605E9e2a1717326eeDFd660601e2753A057'.toLowerCase()],
    // ['ERC1155', '0xCaf94eB06D4dE233c45B353723C387D3E440f3d6'.toLowerCase()],
    ['ERC1155', '0xbF42C1972877F39e102807E5E80ed2ff5D16aa5f'.toLowerCase()],
  ]
  let wallet: WalletInstance
  let wallet721: WalletInstance
  let wallet1155: WalletInstance
  let node: MemoryNode
  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    wallet721 = await HDWallet.random()
    wallet1155 = await HDWallet.random()
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
      { 'network.xyo.evm.interface': 'Erc721' },
    )
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.evm.interface': 'Erc721Enumerable' },
    )
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC1155__factory.abi },
        providers: getProvidersFromEnv,
      }),
      { 'network.xyo.evm.interface': 'Erc1155' },
    )
    locator.register(JsonPatchDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(
      new ModuleFactory(Erc1822Witness, { providers: getProvidersFromEnv }),
    )
    locator.register(
      new ModuleFactory(Erc1967Witness, { providers: getProvidersFromEnv }),
    )

    const manifest = new ManifestWrapper(sentinelNodeManifest as PackageManifestPayload, wallet, locator)
    node = await manifest.loadNodeFromIndex(0)

    const manifest721 = new ManifestWrapper(erc721IndexNodeManifest as PackageManifestPayload, wallet721, locator)
    const node721 = await manifest721.loadNodeFromIndex(0)

    await node.register(node721)
    await node.attach(node721.address, true)

    const manifest1155 = new ManifestWrapper(erc1155IndexNodeManifest as PackageManifestPayload, wallet1155, locator)
    const node1155 = await manifest1155.loadNodeFromIndex(0)

    await node.register(node1155)
    await node.attach(node1155.address, true)
  })
  describe('Sentinel', () => {
    it.each(cases)('With %s (%s)', async (_, address) => {
      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: EvmCall = { address: address.toLowerCase(), schema: EvmCallSchema }
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
      const diviner = asDivinerInstance(await node.resolve('NftInfo:Erc721IndexDiviner'))
      expect(diviner).toBeDefined()
      const query: PayloadDivinerQueryPayload = { address: address.toLowerCase() as Address, schema: PayloadDivinerQuerySchema }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
  describe('ERC1155 Index', () => {
    const erc1155 = cases.filter(([type]) => type === 'ERC1155')
    it.each(erc1155)('With %s (%s)', async (_, address) => {
      const erc1155Node = await resolveLocalNameToInstance(node, 'ERC1155Node')
      expect(erc1155Node).toBeDefined()
      if (erc1155Node) {
        expect(await resolveLocalNameToAddress(erc1155Node, 'Erc1155IndexDiviner')).toBeDefined()
        const modAddress = await resolvePathToAddress(node, 'ERC1155Node:Erc1155IndexDiviner')
        expect(modAddress).toBeDefined()
        if (modAddress) {
          const diviner = asDivinerInstance(await node.resolve(modAddress))
          expect(diviner).toBeDefined()
          const query: PayloadDivinerQueryPayload = { address: address.toLowerCase() as Address, schema: PayloadDivinerQuerySchema }
          const result = await diviner?.divine([query])
          expect(result).toBeDefined()
          expect(result).toBeArrayOfSize(1)
        }
      }
    })
  })
})
