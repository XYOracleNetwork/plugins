import { distinct } from '@xylabs/array'
import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { exists } from '@xylabs/exists'
import { HDWallet } from '@xyo-network/account'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadHasher } from '@xyo-network/core'
import { NftInfo, NftSchema } from '@xyo-network/crypto-nft-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import { PayloadDivinerQueryPayload, PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  isTemporalIndexingDivinerResultIndex,
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { ManifestWrapper, PackageManifest } from '@xyo-network/manifest'
import { MemoryArchivist } from '@xyo-network/memory-archivist'
import { isModuleState, Labels, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'

import imageThumbnailDivinerManifest from './Witness.Index.json'

type Query = PayloadDivinerQueryPayload & { status?: number; success?: boolean; url?: string }

/**
 * @group slow
 */
describe('CryptoWalletNftWitness Index', () => {
  let node: MemoryNode
  let sut: TemporalIndexingDiviner
  const data: NftInfo[] = [
    // 0x0000000000000000000000000000000000000000
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      metadata: {
        description: 'Test NFT Description',
        image: 'https://example.com/image.png',
        name: 'Test NFT',
      },
      schema: NftSchema,
      supply: '1',
      tokenId: '0',
      type: 'ERC721',
      types: ['ERC721'],
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      schema: NftSchema,
      supply: '1',
      tokenId: '1',
      type: 'ERC721',
      types: ['ERC721'],
    },
    // 0x0000000000000000000000000000000000000001
    {
      address: '0x0000000000000000000000000000000000000001',
      chainId: 1,
      schema: NftSchema,
      supply: '1',
      tokenId: '1',
      type: 'ERC721',
      types: ['ERC721'],
    },
    // 0x0000000000000000000000000000000000000002
    {
      address: '0x0000000000000000000000000000000000000002',
      chainId: 1,
      schema: NftSchema,
      supply: '1',
      tokenId: '1',
      type: 'ERC721',
      types: ['ERC721'],
    },
    // 0x0000000000000000000000000000000000000003
    {
      address: '0x0000000000000000000000000000000000000003',
      chainId: 1,
      schema: NftSchema,
      supply: '1',
      tokenId: '1',
      type: 'ERC721',
      types: ['ERC721'],
    },
  ]
  beforeAll(async () => {
    const labels: Labels = {
      'network.xyo.crypto.nft': 'diviner',
    }
    const wallet = await HDWallet.random()
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryArchivist)
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner, labels)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner, labels)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner, labels)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner, labels)
    locator.register(TemporalIndexingDiviner, labels)
    const manifest = imageThumbnailDivinerManifest as PackageManifest
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    await node.start()

    const privateModules = manifest.nodes[0].modules?.private ?? []
    const publicModules = manifest.nodes[0].modules?.public ?? []
    const mods = await node.resolve()
    expect(mods.length).toBe(privateModules.length + publicModules.length + 1)

    // Insert NFTS into archivist
    const payloads = (
      await Promise.all(
        data.map(async (nft) => {
          const timestamp = { schema: 'network.xyo.timestamp', timestamp: Date.now() }
          const [bw, payloads] = await new BoundWitnessBuilder().payloads([nft, timestamp]).build()
          return [bw, ...payloads]
        }),
      )
    ).flat()

    const NftArchivist = assertEx(asArchivistInstance<MemoryArchivist>(await node.resolve('NftArchivist')))
    await NftArchivist.insert(payloads)

    sut = assertEx(asDivinerInstance<TemporalIndexingDiviner>(await node.resolve('NftDiviner')))

    // Allow enough time for diviner to divine
    await delay(5000)
  }, 40000)
  describe('diviner state', () => {
    let stateArchivist: MemoryArchivist
    beforeAll(async () => {
      const mod = await node.resolve('AddressStateArchivist')
      stateArchivist = assertEx(asArchivistInstance<MemoryArchivist>(mod))
    })
    it('has expected bound witnesses', async () => {
      const payloads = await stateArchivist.all()
      const stateBoundWitnesses = payloads.filter(isBoundWitness)
      expect(stateBoundWitnesses).toBeArrayOfSize(2)
      stateBoundWitnesses.forEach((stateBoundWitness) => {
        expect(stateBoundWitness).toBeObject()
        expect(stateBoundWitness.addresses).toBeArrayOfSize(1)
        expect(stateBoundWitness.addresses).toContain(sut.address)
      })
    })
    it('has expected state', async () => {
      const payloads = await stateArchivist.all()
      const statePayloads = payloads.filter(isModuleState)
      expect(statePayloads).toBeArrayOfSize(2)
      expect(statePayloads.at(-1)).toBeObject()
      const statePayload = assertEx(statePayloads.at(-1))
      expect(statePayload.state).toBeObject()
      expect(statePayload.state?.offset).toBe(data.length)
    })
  })
  describe('diviner index', () => {
    let indexArchivist: MemoryArchivist
    beforeAll(async () => {
      const mod = await node.resolve('NftDivinerIndexArchivist')
      indexArchivist = assertEx(asArchivistInstance<MemoryArchivist>(mod))
    })
    it('has expected index', async () => {
      const payloads = await indexArchivist.all()
      const indexPayloads = payloads.filter(isTemporalIndexingDivinerResultIndex)
      expect(indexPayloads).toBeArrayOfSize(data.length)
    })
  })
  describe('with no Nft for the provided Address', () => {
    const address = '0x9000000000000000000000000000000000000000'
    const schema = PayloadDivinerQuerySchema
    it('returns nothing', async () => {
      const query: Query = { address, schema }
      const result = await sut.divine([query])
      expect(result).toBeArrayOfSize(0)
    })
  })
  describe('with Nfts for the provided Address', () => {
    const schema = PayloadDivinerQuerySchema
    describe('with no filter criteria', () => {
      it('returns the most recent result', async () => {
        const query: Query = { schema }
        const results = await sut.divine([query])
        const result = results.find(isTemporalIndexingDivinerResultIndex)
        expect(result).toBeDefined()
        const last = data.at(-1)
        const expected = await PayloadHasher.hashAsync(assertEx(last))
        expect(result?.sources).toContain(expected)
      })
    })
    describe('with filter criteria', () => {
      describe('for address', () => {
        const addresses = data.map((nft) => nft.address).filter(distinct)
        const cases: NftInfo[] = addresses.map((address) => data.findLast((nft) => nft.address === address)).filter(exists)
        it.each(cases)('returns the most recent instance of that address', async (payload) => {
          const { address } = payload
          const query: Query = { address, schema }
          const results = await sut.divine([query])
          const result = results.find(isTemporalIndexingDivinerResultIndex)
          expect(result).toBeDefined()
          const expected = await PayloadHasher.hashAsync(payload)
          expect(result?.sources).toContain(expected)
        })
      })
    })
  })
})
