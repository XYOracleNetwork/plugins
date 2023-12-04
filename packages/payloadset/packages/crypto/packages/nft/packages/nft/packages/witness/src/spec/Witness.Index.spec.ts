import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { HDWallet } from '@xyo-network/account'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadHasher } from '@xyo-network/core'
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
import { Payload } from '@xyo-network/payload-model'

import imageThumbnailDivinerManifest from './Witness.Index.json'

/**
 * @group slow
 */
describe('CryptoWalletNftWitness Index', () => {
  let node: MemoryNode
  let sut: TemporalIndexingDiviner
  beforeAll(async () => {
    const labels: Labels = {
      'network.xyo.image.thumbnail': 'diviner',
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
    const thumbnailArchivist = assertEx(asArchivistInstance<MemoryArchivist>(await node.resolve('ImageThumbnailArchivist')))
    await thumbnailArchivist.insert([])

    sut = assertEx(asDivinerInstance<TemporalIndexingDiviner>(await node.resolve('ImageThumbnailDiviner')))

    // Allow enough time for diviner to divine
    await delay(5000)
  }, 40000)
  describe('Indexed NFT Info', () => {
    it('has tests', async () => {
      // TODO
    })
  })
})
