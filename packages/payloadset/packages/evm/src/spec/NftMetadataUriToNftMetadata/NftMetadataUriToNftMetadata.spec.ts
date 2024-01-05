import { delay } from '@xylabs/delay'
import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet } from '@xyo-network/account'
import { ApiCall, ApiCallSchema, ApiCallWitness, isApiCallResult } from '@xyo-network/api-call-witness'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'

import nftIdToNftMetadataUri from './NftMetadataUriToNftMetadata.json'

const maxProviders = 2
const providers = getProvidersFromEnv(maxProviders)

describeIf(providers.length)('NftMetadataUriToNftMetadata', () => {
  const chainId = 1
  let node: MemoryNode
  const cases: ApiCall[] = [
    // {
    //   schema: ApiCallSchema,
    //   // BAYC
    //   uri: 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/15',
    // },
    {
      schema: ApiCallSchema,
      // Gutter Cats
      uri: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347',
    },
  ]
  beforeAll(async () => {
    const wallet = await HDWallet.random()
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner)
    locator.register(TemporalIndexingDiviner)
    locator.register(TimestampWitness)
    locator.register(ApiCallWitness)
    const manifest = nftIdToNftMetadataUri as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    const mods = await node.resolve()
    const publicModules = manifest.nodes[0].modules?.public ?? []
    expect(mods.length).toBe(publicModules.length + 1)
  })
  describe('Sentinel', () => {
    it.each(cases)('returns metadata URI for token ID', async (apiCall) => {
      const sentinel = asSentinelInstance(await node.resolve('NftMetadataSentinel'))
      expect(sentinel).toBeDefined()
      const report = await sentinel?.report([apiCall])
      const results = report?.filter(isApiCallResult) ?? []
      expect(results.length).toBe(1)
      // TODO: Assert JSON result here
    })
  })
  describe.skip('Index', () => {
    it.each(cases)('returns indexed NftIndex results', async (address, tokenId) => {
      await delay(100)
      const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
      expect(diviner).toBeDefined()
      const query = { address, chainId, length: 1, schema: PayloadDivinerQuerySchema, tokenId }
      const result = (await diviner?.divine([query])) as unknown as Payload<{ address?: string; chainId?: number; tokenId?: string }>[]
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]?.address).toBe(address)
      expect(result?.[0]?.chainId).toBe(chainId)
      expect(result?.[0]?.tokenId).toBe(tokenId)
    })
  })
})
