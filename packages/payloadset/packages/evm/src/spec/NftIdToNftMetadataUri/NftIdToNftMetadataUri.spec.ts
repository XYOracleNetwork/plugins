import '@xylabs/vitest-extended'

import { delay } from '@xylabs/delay'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { EvmCallResultToNftTokenUriDiviner } from '@xyo-network/diviner-evm-call-result-to-token-uri'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { GenericPayloadDiviner } from '@xyo-network/diviner-payload-generic'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import type { EvmCall, EvmCallWitnessParams } from '@xyo-network/evm-call-witness'
import {
  EvmCallDiviner, EvmCallSchema, EvmCallWitness,
} from '@xyo-network/evm-call-witness'
import { isNftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { ERC721URIStorage__factory } from '@xyo-network/open-zeppelin-typechain'
import type { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import nftIdToNftMetadataUri from './NftIdToNftMetadataUri.json' with { type: 'json' }

const maxProviders = 2
const providers = getProvidersFromEnv(maxProviders)

describe.skipIf(providers.length === 0)('NftIdToNftMetadataUri', () => {
  const chainId = 1
  let node: MemoryNode
  const cases = [
    // Bored Apes
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', '0x0f'],
    // Gutter Cat Gang
    ['0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452', '0x543'],
  ]
  beforeAll(async () => {
    const wallet = await HDWallet.random()
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryBoundWitnessDiviner.factory())
    locator.register(GenericPayloadDiviner.factory())
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner.factory())
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner.factory())
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner.factory())
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner.factory())
    locator.register(TemporalIndexingDiviner.factory())
    locator.register(TimestampWitness.factory())
    locator.register(EvmCallDiviner.factory())
    locator.register(EvmCallResultToNftTokenUriDiviner.factory())
    locator.register(
      new ModuleFactory(EvmCallWitness, {
        config: { abi: ERC721URIStorage__factory.abi },
        providers: () => getProvidersFromEnv(maxProviders),
      } as EvmCallWitnessParams),
      { 'network.xyo.evm.interface': 'ERC721TokenUri' },
    )
    const manifest = nftIdToNftMetadataUri as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    const mods = await node.resolve('*')
    const publicModules = manifest.nodes[0].modules?.public ?? []
    expect(mods.length).toBeGreaterThan(publicModules.length)
  })
  describe('Sentinel', () => {
    it.each(cases)('returns metadata URI for token ID', async (address, tokenId) => {
      const tokenCallPayload: EvmCall = {
        address, args: [tokenId], schema: EvmCallSchema,
      }
      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenUriSentinel'))
      expect(tokenSentinel).toBeDefined()
      const report = await tokenSentinel?.report([tokenCallPayload])
      const results = report?.filter(isNftMetadataUri) ?? []
      expect(results.length).toBe(1)
      expect(results?.[0]?.address).toBe(address)
      expect(results?.[0]?.chainId).toBe(chainId)
      expect(results?.[0]?.tokenId).toBe(tokenId)
      expect(results?.[0]?.schema).toBe(NftMetadataUriSchema)
      expect(results?.[0]?.metadataUri).toBeString()
      const num = Number(BigInt(tokenId)).toString()
      // It is not always true that the metadata URI contains the token ID, but
      // it is true for the cases we are testing
      expect(results?.[0]?.metadataUri).toContain(num)
    })
  })
  describe.skip('Index', () => {
    beforeAll(async () => {
      await delay(100)
    })
    it.each(cases)('returns indexed NftIndex results', async (address, tokenId) => {
      const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
      expect(diviner).toBeDefined()
      const query = {
        address, chainId, length: 1, schema: PayloadDivinerQuerySchema, tokenId,
      }
      const result = (await diviner?.divine([query])) as unknown as Payload<{ address?: string; chainId?: number; tokenId?: string }>[]
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]?.address).toBe(address)
      expect(result?.[0]?.chainId).toBe(chainId)
      expect(result?.[0]?.tokenId).toBe(tokenId)
    })
  })
})
