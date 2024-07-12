import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { HDWallet } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { isBoundWitnessWithMeta } from '@xyo-network/boundwitness-model'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import {
  ImageThumbnail,
  ImageThumbnailDivinerQuery,
  ImageThumbnailDivinerQuerySchema,
  isImageThumbnailResult,
  isImageThumbnailResultIndex,
} from '@xyo-network/image-thumbnail-payload-plugin'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { isModuleStateWithMeta } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { TimeStamp, TimestampSchema } from '@xyo-network/witness-timestamp'

import { ImageThumbnailDiviner } from '../Diviner.js'
import { ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner } from '../ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner.js'
import { ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner } from '../ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner.js'
import { ImageThumbnailQueryToImageThumbnailIndexQueryDiviner } from '../ImageThumbnailQueryToImageThumbnailIndexQueryDiviner.js'
import { ImageThumbnailStateToIndexCandidateDiviner } from '../ImageThumbnailStateToIndexCandidateDiviner/index.js'
import imageThumbnailDivinerManifest from './ImageThumbnailDivinerManifest.json'

/**
 * @group slow
 */
describe('ImageThumbnailDiviner', () => {
  const sourceUrl = 'https://placekitten.com/200/300'
  const thumbnailHttpSuccess: ImageThumbnail = {
    http: {
      status: 200,
    },
    schema: 'network.xyo.image.thumbnail',
    sourceHash: '7f39363514d9d9b958a5a993edeba35cb44f912c7072ed9ddd628728ac0fd681',
    sourceUrl,
    url: 'data:image/png;base64,===',
  }

  const thumbnailHttpFail: ImageThumbnail = {
    http: {
      ipAddress: '104.17.96.13',
      status: 429,
    },
    schema: 'network.xyo.image.thumbnail',
    sourceUrl,
  }

  const thumbnailCodeFail: ImageThumbnail = {
    http: {
      code: 'FAILED',
    },
    schema: 'network.xyo.image.thumbnail',
    sourceUrl,
  }

  const thumbnailWitnessFail: ImageThumbnail = {
    http: {
      ipAddress: '104.17.96.13',
    },
    schema: 'network.xyo.image.thumbnail',
    sourceUrl,
  }
  const witnessedThumbnails = [thumbnailHttpSuccess, thumbnailHttpFail, thumbnailCodeFail, thumbnailWitnessFail]

  let sut: ImageThumbnailDiviner
  let node: MemoryNode

  beforeAll(async () => {
    const wallet = await HDWallet.random()
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryArchivist)
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner)
    locator.register(ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner)
    locator.register(ImageThumbnailQueryToImageThumbnailIndexQueryDiviner)
    locator.register(ImageThumbnailStateToIndexCandidateDiviner)
    locator.register(ImageThumbnailDiviner)
    const manifest = imageThumbnailDivinerManifest as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    await node.start()

    const privateModules = manifest.nodes[0].modules?.private ?? []
    const publicModules = manifest.nodes[0].modules?.public ?? []
    const mods = await node.resolve('*')
    expect(mods.length).toBe(privateModules.length + publicModules.length + 1)

    // Insert previously witnessed payloads into thumbnail archivist
    const httpSuccessTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: Date.now() }
    const [httpSuccessBoundWitness, httpSuccessPayloads] = await (
      await new BoundWitnessBuilder().payloads([thumbnailHttpSuccess, httpSuccessTimestamp])
    ).build()
    const httpFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: Date.now() }
    const [httpFailBoundWitness, httpFailPayloads] = await (await new BoundWitnessBuilder().payloads([thumbnailHttpFail, httpFailTimestamp])).build()

    const witnessFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: Date.now() }
    const [witnessFailBoundWitness, witnessFailPayloads] = await (
      await new BoundWitnessBuilder().payloads([thumbnailWitnessFail, witnessFailTimestamp])
    ).build()

    const codeFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: Date.now() }
    const [codeFailBoundWitness, codeFailPayloads] = await (await new BoundWitnessBuilder().payloads([thumbnailCodeFail, codeFailTimestamp])).build()

    const thumbnailArchivist = assertEx(asArchivistInstance<MemoryArchivist>(await node.resolve('ImageThumbnailArchivist')))
    await thumbnailArchivist.insert([
      httpSuccessBoundWitness,
      ...httpSuccessPayloads,
      httpFailBoundWitness,
      ...httpFailPayloads,
      witnessFailBoundWitness,
      ...witnessFailPayloads,
      codeFailBoundWitness,
      ...codeFailPayloads,
    ])

    sut = assertEx(asDivinerInstance<ImageThumbnailDiviner>(await node.resolve('ImageThumbnailDiviner')))

    // Allow enough time for diviner to divine
    await delay(5000)
  }, 40_000)
  describe('diviner state', () => {
    let stateArchivist: MemoryArchivist
    beforeAll(async () => {
      const mod = await node.resolve('AddressStateArchivist')
      stateArchivist = assertEx(asArchivistInstance<MemoryArchivist>(mod))
    })
    it('has expected bound witnesses', async () => {
      const payloads = await stateArchivist.all()
      const stateBoundWitnesses = payloads.filter(isBoundWitnessWithMeta)
      expect(stateBoundWitnesses).toBeArrayOfSize(2)
      for (const stateBoundWitness of stateBoundWitnesses) {
        expect(stateBoundWitness).toBeObject()
        expect(stateBoundWitness.addresses).toBeArrayOfSize(1)
        expect(stateBoundWitness.addresses).toContain(sut.address)
      }
    })
    it('has expected state', async () => {
      const payloads = await stateArchivist.all()
      const statePayloads = payloads.filter(isModuleStateWithMeta)
      expect(statePayloads).toBeArrayOfSize(2)
      expect(statePayloads.at(-1)).toBeObject()
      const statePayload = assertEx(statePayloads.at(-1))
      expect(statePayload.state).toBeObject()
      expect(statePayload.state?.offset).toBe(witnessedThumbnails.length)
    })
  })
  describe('diviner index', () => {
    let indexArchivist: MemoryArchivist
    beforeAll(async () => {
      const mod = await node.resolve('ImageThumbnailDivinerIndexArchivist')
      indexArchivist = assertEx(asArchivistInstance<MemoryArchivist>(mod))
    })
    // NOTE: We're not signing indexes for performance reasons
    it.skip('has expected bound witnesses', async () => {
      const payloads = await indexArchivist.all()
      const indexBoundWitnesses = payloads.filter(isBoundWitnessWithMeta)
      expect(indexBoundWitnesses).toBeArrayOfSize(1)
      const indexBoundWitness = indexBoundWitnesses[0]
      expect(indexBoundWitness).toBeObject()
      expect(indexBoundWitness.addresses).toBeArrayOfSize(1)
      expect(indexBoundWitness.addresses).toContain(sut.address)
    })
    it('has expected index', async () => {
      const payloads = await indexArchivist.all()
      const indexPayloads = payloads.filter(isImageThumbnailResultIndex)
      expect(indexPayloads).toBeArrayOfSize(witnessedThumbnails.length)
    })
  })
  describe('with no thumbnail for the provided URL', () => {
    const url = 'https://does.not.exist.io'
    const schema = ImageThumbnailDivinerQuerySchema
    it('returns nothing', async () => {
      const query: ImageThumbnailDivinerQuery = { schema, url }
      const result = await sut.divine([query])
      expect(result).toBeArrayOfSize(0)
    })
  })
  describe('with thumbnails for the provided URL', () => {
    const url = sourceUrl
    const schema = ImageThumbnailDivinerQuerySchema
    describe('with no filter criteria', () => {
      it('returns the most recent success', async () => {
        const query: ImageThumbnailDivinerQuery = { schema, success: true, url }
        const results = await sut.divine([query])
        const result = results.find(isImageThumbnailResult)
        expect(result).toBeDefined()
        const expected = await PayloadBuilder.dataHash(thumbnailHttpSuccess)
        expect(result?.sources).toContain(expected)
      })
    })
    describe('with filter criteria', () => {
      describe('for status code', () => {
        const cases: ImageThumbnail[] = [thumbnailHttpSuccess, thumbnailHttpFail]
        it.each(cases)('returns the most recent instance of that status code', async (payload) => {
          const { status } = payload.http ?? {}
          const query: ImageThumbnailDivinerQuery = { schema, status, url }
          const results = await sut.divine([query])
          const result = results.find(isImageThumbnailResult)
          expect(result).toBeDefined()
          const expected = await PayloadBuilder.dataHash(payload)
          expect(result?.sources).toContain(expected)
        })
      })
      describe('for success (most recent)', () => {
        const cases: ImageThumbnail[] = [thumbnailHttpSuccess]
        it.each(cases)('returns the most recent instance of that success state', async (payload) => {
          const success = !!(payload.url ?? false)
          const query: ImageThumbnailDivinerQuery = { schema, success, url }
          const results = await sut.divine([query])
          const result = results.find(isImageThumbnailResult)
          expect(result).toBeDefined()
          const expected = await PayloadBuilder.dataHash(payload)
          expect(result?.sources).toContain(expected)
        })
      })
      describe('for failure (most recent)', () => {
        const cases: ImageThumbnail[] = [thumbnailCodeFail]
        it.each(cases)('returns the most recent instance of that success state', async (payload) => {
          const success = !!(payload.url ?? false)
          const query: ImageThumbnailDivinerQuery = { schema, success, url }
          const results = await sut.divine([query])
          const result = results.find(isImageThumbnailResult)
          expect(result).toBeDefined()
          const expected = await PayloadBuilder.dataHash(payload)
          expect(result?.sources).toContain(expected)
        })
      })
    })
  })
})
