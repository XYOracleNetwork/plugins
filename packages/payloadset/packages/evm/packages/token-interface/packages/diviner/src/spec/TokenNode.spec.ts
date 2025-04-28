import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
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
import type { EvmContract } from '@xyo-network/evm-contract-witness'
import { EvmContractWitness, isEvmContract } from '@xyo-network/evm-contract-witness'
import type { ModuleManifest, PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import type { WalletInstance } from '@xyo-network/wallet-model'
import type { EvmAddress } from '@xyo-network/witness-evm-abstract'
import { EvmAddressSchema, getProviderFromEnv } from '@xyo-network/witness-evm-abstract'
import type { TimeStamp } from '@xyo-network/witness-timestamp'
import { isTimestamp, TimestampWitness } from '@xyo-network/witness-timestamp'
import type { Provider } from 'ethers'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { EvmTokenInterfaceImplementedDiviner } from '../Diviner.ts'
import type { TokenInterface } from '../Payload.ts'
import { isEvmTokenInterfaceImplemented } from '../Payload.ts'
import contractWitnessManifest from './Contract.Witness.Index.json' with { type: 'json' }
import tokenDivinerManifest from './Token.Diviner.Index.json' with { type: 'json' }
import tokenNodeManifest from './TokenNode.json' with { type: 'json' }

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
      new ModuleFactory(EvmContractWitness, { providers: getProviders }),
    )
    const publicChildren: ModuleManifest[] = [...contractWitnessManifest.nodes, ...tokenDivinerManifest.nodes]
    const manifest = new ManifestWrapper(tokenNodeManifest as PackageManifestPayload, wallet, locator, publicChildren)
    node = assertEx((await manifest.loadNodes()).at(0), () => 'Node not loaded')
    const mods = await node.resolve('*')
    expect(mods).toBeDefined()
  })
  describe('Contract Witness Index Node', () => {
    it.each(cases)('With %s (%s)', async (tokenInterface, address) => {
      const contractSentinel = asSentinelInstance(await node.resolve('EvmContractSentinel'))
      expect(contractSentinel).toBeDefined()
      const collectionCallPayload: EvmAddress = {
        address, chainId, schema: EvmAddressSchema,
      }
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
      const anyInterfacesImplemented = tokenReport?.filter(isEvmTokenInterfaceImplemented).some(i => i.implemented)
      expect(anyInterfacesImplemented).toBeTrue()
    })
  })
  describe.skip('Token Diviner Index Node', () => {
    beforeAll(async () => {
      // Alow indexers to index
      await delay(1000)
    })
    it.each(cases)('With %s (%s)', async (tokenInterface, address) => {
      const divinerModule = await node.resolve('EvmTokenInterfaceImplementedIndexDiviner')
      expect(divinerModule).toBeDefined()
      const diviner = asDivinerInstance(divinerModule)
      expect(diviner).toBeDefined()
      const query = {
        address, chainId, implemented: true, schema: PayloadDivinerQuerySchema, tokenInterface,
      }
      const result = await diviner?.divine([query])
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
