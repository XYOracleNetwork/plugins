import '@xylabs/vitest-extended'

import { filterAs } from '@xylabs/array'
import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { GenericPayloadDiviner } from '@xyo-network/diviner-payload-generic'
import type { ImageThumbnail } from '@xyo-network/image-thumbnail-payload-plugin'
import { isImageThumbnail } from '@xyo-network/image-thumbnail-payload-plugin'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import type { ModuleState } from '@xyo-network/module-model'
import { isModuleState, ModuleStateSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, WithStorageMeta } from '@xyo-network/payload-model'
import { asOptionalStorageMeta } from '@xyo-network/payload-model'
import { HDWallet } from '@xyo-network/wallet'
import type { TimeStamp } from '@xyo-network/witness-timestamp'
import { isTimestamp, TimestampSchema } from '@xyo-network/witness-timestamp'
import {
  beforeAll,
  describe, expect,
  it,
} from 'vitest'

import type { ImageThumbnailDivinerState } from '../../ImageThumbnailDivinerState.ts'
import { ImageThumbnailStateToIndexCandidateDiviner } from '../Diviner.ts'
import ImageThumbnailStateToIndexCandidateDivinerManifest from './ImageThumbnailStateToIndexCandidateDiviner.json' with { type: 'json' }

/**
 * @group slow
 */
describe('ImageThumbnailStateToIndexCandidateDiviner', () => {
  const sourceUrl = 'https://placekitten.com/200/300'
  const thumbnailHttpSuccess: ImageThumbnail = {
    http: { status: 200 },
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
    http: { code: 'FAILED' },
    schema: 'network.xyo.image.thumbnail',
    sourceUrl,
  }

  const thumbnailWitnessFail: ImageThumbnail = {
    http: { ipAddress: '104.17.96.13' },
    schema: 'network.xyo.image.thumbnail',
    sourceUrl,
  }

  let testCases: WithStorageMeta<Payload>[][] = []
  let archivist: MemoryArchivist
  let sut: ImageThumbnailStateToIndexCandidateDiviner

  beforeAll(async () => {
    const wallet = await HDWallet.random()
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryArchivist.factory())
    locator.register(MemoryBoundWitnessDiviner.factory())
    locator.register(GenericPayloadDiviner.factory())
    locator.register(ImageThumbnailStateToIndexCandidateDiviner.factory())
    const manifest = ImageThumbnailStateToIndexCandidateDivinerManifest as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    const node = await manifestWrapper.loadNodeFromIndex(0)
    await node.start()

    const privateModules = manifest.nodes[0].modules?.private ?? []
    const publicModules = manifest.nodes[0].modules?.public ?? []
    const mods = await node.resolve('*')
    expect(mods.length).toBe(privateModules.length + publicModules.length + 1)

    // Insert previously witnessed payloads into thumbnail archivist
    const httpSuccessTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: 1 }
    const [httpSuccessBoundWitness, httpSuccessPayloads] = await new BoundWitnessBuilder()
      .payloads([thumbnailHttpSuccess, httpSuccessTimestamp])
      .build()

    const httpFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: 2 }
    const [httpFailBoundWitness, httpFailPayloads] = await new BoundWitnessBuilder().payloads([thumbnailHttpFail, httpFailTimestamp]).build()

    const witnessFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: 3 }
    const [witnessFailBoundWitness, witnessFailPayloads] = await new BoundWitnessBuilder()
      .payloads([thumbnailWitnessFail, witnessFailTimestamp])
      .build()

    const codeFailTimestamp: TimeStamp = { schema: TimestampSchema, timestamp: 4 }
    const [codeFailBoundWitness, codeFailPayloads] = await new BoundWitnessBuilder().payloads([thumbnailCodeFail, codeFailTimestamp]).build()

    archivist = assertEx(asArchivistInstance<MemoryArchivist>(await node.resolve('ImageThumbnailArchivist')))
    const testCasesToCreate = [
      [httpSuccessBoundWitness, ...httpSuccessPayloads],
      [httpFailBoundWitness, ...httpFailPayloads],
      [witnessFailBoundWitness, ...witnessFailPayloads],
      [codeFailBoundWitness, ...codeFailPayloads],
    ]

    for (const [bw, ...payloads] of testCasesToCreate) {
      const createdTestCase = []
      for (const payload of [bw, ...payloads]) {
        await delay(2)
        const [signedPayload] = await archivist.insert([payload])
        createdTestCase.push(signedPayload)
      }
      testCases.push(createdTestCase)
    }

    sut = assertEx(asDivinerInstance(await node.resolve('ImageThumbnailStateToIndexCandidateDiviner'))) as ImageThumbnailStateToIndexCandidateDiviner
  })

  describe('divine', () => {
    describe('with no previous state', () => {
      it('returns next state and batch results', async () => {
        const results = await sut.divine()
        expect(results.length).toBe(testCases.flat().length + 1)
        const state = results.find(isModuleState<ImageThumbnailDivinerState>) as WithStorageMeta<ModuleState<ImageThumbnailDivinerState>>
        expect(state).toBeDefined()
        const last = filterAs(results, asOptionalStorageMeta)
          .map(p => p as WithStorageMeta<Payload>)
          .sort(PayloadBuilder.compareStorageMeta)
          .at(-1)
        expect(last).toBeDefined()
        expect(state?.state.cursor).toBe(last?._sequence)
      })
    })
    describe('with previous state', () => {
      it.each([1, 2, 3])('returns next state and batch results', async (batch) => {
        const all = (await archivist.all()).sort(PayloadBuilder.compareStorageMeta)
        const batchOffset = all.at((3 * batch) - 1)
        expect(batchOffset).toBeDefined()
        // Test across all offsets
        const cursor = assertEx(batchOffset)._sequence
        const lastState: ModuleState<ImageThumbnailDivinerState> = { schema: ModuleStateSchema, state: { cursor } }
        const results = await sut.divine([lastState])

        // Validate expected results length
        // [BW, ImageThumbnail, TimeStamp] + 1 [ModuleState]
        const expectedResults = testCases.slice(batch).flat().length + 1
        expect(results.length).toBe(expectedResults)

        // Validate expected state
        const nextState = results.find(isModuleState<ImageThumbnailDivinerState>)
        expect(nextState).toBeDefined()
        expect(nextState?.state?.cursor).toBeDefined()
        expect(nextState?.state.cursor).toBe(testCases?.at(-1)?.at(-1)?._sequence)

        // Validate expected individual results
        const bws = results.filter(isBoundWitness)
        expect(bws.length).toBeGreaterThan(0)
        const images = results.filter(isImageThumbnail)
        expect(images.length).toBeGreaterThan(0)
        const timestamps = results.filter(isTimestamp)
        expect(timestamps.length).toBeGreaterThan(0)
      })
    })
  })
})
