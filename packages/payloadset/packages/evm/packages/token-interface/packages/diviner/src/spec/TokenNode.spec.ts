/* eslint-disable max-statements */
import { delay } from '@xylabs/delay'
import { HDWallet, WalletInstance } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { StatefulDiviner } from '@xyo-network/diviner-stateful'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { EvmContract, EvmContractWitness, isEvmContract } from '@xyo-network/evm-contract-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { EvmAddress, EvmAddressSchema, getProviderFromEnv } from '@xyo-network/witness-evm-abstract'
import { isTimestamp, TimeStamp, TimestampWitness } from '@xyo-network/witness-timestamp'
import { Provider } from 'ethers'

import { EvmTokenInterfaceImplementedDiviner } from '../Diviner'
import { isEvmTokenInterfaceImplemented, TokenInterface } from '../Payload'
import contractWitnessManifest from './Contract.Witness.Index.json'
import tokenDivinerManifest from './Token.Diviner.Index.json'
import tokenNodeManifest from './TokenNode.json'

const maxProviders = 32

describe('Contract Node', () => {
  const chainId = 1
  const cases: [TokenInterface, string][] = [
    ['ERC721', '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'], // BAYC
    ['ERC1155', '0x2A6d6a082C410a195157EC4caf67CB9fD718f087'], // Spider Tanks
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
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(JsonPatchDiviner)
    locator.register(StatefulDiviner)
    locator.register(EvmTokenInterfaceImplementedDiviner)
    locator.register(
      new ModuleFactory(EvmContractWitness, {
        providers: getProviders,
      }),
    )
    const publicChildren: PackageManifestPayload[] = [
      contractWitnessManifest as PackageManifestPayload,
      tokenDivinerManifest as PackageManifestPayload,
    ]
    const manifest = new ManifestWrapper(tokenNodeManifest as PackageManifestPayload, wallet, locator, publicChildren)
    node = await manifest.loadNodeFromIndex(0)
    const mods = await node.resolve('*')
    expect(mods).toBeDefined()
  })
  describe('Contract Witness Index Node', () => {
    it.each(cases)('With %s (%s)', async (tokenInterface, address) => {
      const contractSentinel = asSentinelInstance(await node.resolve('EvmContractSentinel'))
      expect(contractSentinel).toBeDefined()
      const collectionCallPayload: EvmAddress = { address, chainId, schema: EvmAddressSchema }
      const report = await contractSentinel?.report([collectionCallPayload])
      expect(report).toBeDefined()
      expect(report).toBeArrayOfSize(3)
      const [bw, timestamp, contract] = (report as [BoundWitness, TimeStamp, EvmContract]) ?? []
      expect(isBoundWitness(bw)).toBeTrue()
      expect(isTimestamp(timestamp)).toBeTrue()
      expect(isEvmContract(contract)).toBeTrue()
      expect(contract.address).toBe(address)
      expect(contract.chainId).toBe(chainId)
      expect(contract.code).toBeDefined()
      const divinerName = `${tokenInterface}TokenInterfaceImplementedSentinel`
      const tokenSentinel = asSentinelInstance(await node.resolve(divinerName))
      expect(tokenSentinel).toBeDefined()
      const tokenReport = await tokenSentinel?.report([contract])
      expect(tokenReport).toBeDefined()
      const anyInterfacesImplemented = tokenReport?.filter(isEvmTokenInterfaceImplemented).some((i) => i.implemented)
      expect(anyInterfacesImplemented).toBeTrue()
    })
  })
  describe('Token Diviner Index Node', () => {
    beforeAll(async () => {
      // Alow indexers to index
      await delay(1000)
    })
    it.each(cases)('With %s (%s)', async (tokenInterface, address) => {
      const diviner = asDivinerInstance(await node.resolve('EvmTokenInterfaceImplementedIndexDiviner'))
      expect(diviner).toBeDefined()
      const query = { address, chainId, implemented: true, schema: PayloadDivinerQuerySchema, tokenInterface }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
