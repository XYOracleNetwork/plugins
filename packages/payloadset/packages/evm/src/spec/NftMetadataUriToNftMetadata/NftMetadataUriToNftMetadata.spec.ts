import '@xylabs/vitest-extended'

import { delay } from '@xylabs/delay'
import type { ApiCallWitnessParams, ApiUriCallPayload } from '@xyo-network/api-call-witness'
import {
  ApiCallSchema, ApiCallWitness, ApiCallWitnessConfigSchema,
  isApiCallJsonResult,
} from '@xyo-network/api-call-witness'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import type { OpenSeaNftMetadata } from '@xyo-network/crypto-nft-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
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
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import nftIdToNftMetadataUri from './NftMetadataUriToNftMetadata.json' with { type: 'json' }

const maxProviders = 2
const providers = getProvidersFromEnv(maxProviders)

describe.skipIf(providers.length === 0)('NftMetadataUriToNftMetadata', () => {
  let node: MemoryNode
  const cases: ApiUriCallPayload[] = [
    {
      schema: ApiCallSchema,
      // BAYC
      uri: 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/15',
    },
    /* {
      schema: ApiCallSchema,
      // Gutter Cats
      uri: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347',
    }, */
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
    locator.register(
      new ModuleFactory(ApiCallWitness, {
        config: { schema: ApiCallWitnessConfigSchema },
        ipfsGateway: '5d7b6582.beta.decentralnetworkservices.com',
      } as ApiCallWitnessParams),
    )
    const manifest = nftIdToNftMetadataUri as unknown as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    const mods = await node.resolve('*')
    const publicModules = manifest.nodes[0].modules?.public ?? []
    expect(mods.length).toBeGreaterThan(publicModules.length)
  })
  describe('Sentinel', () => {
    it.each(cases)('returns metadata URI for token ID', async (apiCall) => {
      const sentinel = asSentinelInstance(await node.resolve('NftMetadataSentinel'))
      expect(sentinel).toBeDefined()
      const report = await sentinel?.report([apiCall])
      const results = report?.filter(isApiCallJsonResult) ?? []
      expect(results.length).toBe(1)
      expect(results[0].data).toBeObject()
      const metadata = results[0].data as OpenSeaNftMetadata
      expect(metadata.image).toBeString()
      expect(metadata.attributes).toBeArray()
    })
  })
  describe.skip('Index', () => {
    beforeAll(async () => {
      await delay(1000)
    }, 60_000)
    it.each(cases)('returns indexed NftIndex results', async (apiCall) => {
      const { uri } = apiCall
      const archivistModule = await node.resolvePrivate('IndexArchivist')
      expect(archivistModule).toBeDefined()
      const archivist = asArchivistInstance(archivistModule)
      expect(archivist).toBeDefined()
      expect(archivist?.all).toBeDefined()
      const allPayload = (await archivist?.next({ limit: 20_000 })) ?? []
      console.log('uri', uri)
      console.log(JSON.stringify(allPayload, null, 2))
      expect(allPayload).toBeArrayOfSize(1)
      const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
      expect(diviner).toBeDefined()
      const query = {
        limit: 1, schema: PayloadDivinerQuerySchema, uri,
      }
      const result = (await diviner?.divine([query])) as unknown as Payload<{ uri: string }>[]
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]?.uri).toBe(uri)
    }, 20_000)
  })
})
