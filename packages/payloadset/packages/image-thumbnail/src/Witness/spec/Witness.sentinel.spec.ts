import { delay } from '@xylabs/delay'
import { Account } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { isImageThumbnail } from '@xyo-network/image-thumbnail-payload-plugin'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import { SentinelWrapper } from '@xyo-network/sentinel-wrapper'
import type { UrlPayload } from '@xyo-network/url-payload-plugin'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import { isTimestamp, TimestampWitness } from '@xyo-network/witness-timestamp'

import { ImageThumbnailWitness } from '../Witness.ts'

/**
 * @group thumbnail
 * @group sentinel
 */

describe('Witness', () => {
  describe('when behind sentinel', () => {
    const archivistName = 'archivist'
    let thumbnailWitness: ImageThumbnailWitness
    let timestampWitness: TimestampWitness
    let archivist: MemoryArchivist
    let sentinel: MemorySentinel
    let node: MemoryNode
    // const logger = mock<Console>()

    beforeAll(async () => {
      thumbnailWitness = await ImageThumbnailWitness.create({
        account: 'random',
        config: { schema: ImageThumbnailWitness.defaultConfigSchema },
        // logger,
      })
      timestampWitness = await TimestampWitness.create({
        account: 'random',
        config: { schema: TimestampWitness.defaultConfigSchema },
        // logger,
      })
      archivist = await MemoryArchivist.create({
        account: 'random',
        config: { name: archivistName, schema: MemoryArchivist.defaultConfigSchema },
      })
      sentinel = await MemorySentinel.create({
        account: 'random',
        config: {
          archiving: { archivists: [archivist.address] },
          schema: MemorySentinel.defaultConfigSchema,
          synchronous: true,
          tasks: [{ input: true, mod: thumbnailWitness.address }, { mod: timestampWitness.address }],
        },
        // logger,
      })
      const modules = [timestampWitness, thumbnailWitness, archivist, sentinel]
      node = await MemoryNode.create({
        account: 'random',
        config: { schema: MemoryNode.defaultConfigSchema },
        // logger,
      })
      await node.start()
      await Promise.all(
        modules.map(async (mod) => {
          await node.register(mod)
          await node.attach(mod.address, true)
        }),
      )
    })
    it('witnesses thumbnail for url', async () => {
      // TODO: Replace with data url for speed
      // const url =
      // eslint-disable-next-line @stylistic/max-len
      //   "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='yellow' stroke='black' stroke-width='2'/><circle cx='35' cy='35' r='5' fill='black'/><circle cx='65' cy='35' r='5' fill='black'/><path d='M 35 70 Q 50 85, 65 70' fill='none' stroke='black' stroke-width='2'/></svg>"
      const url = 'https://placekitten.com/200/300'
      const query = await new PayloadBuilder<UrlPayload>({ schema: UrlSchema }).fields({ url }).build()
      const sentinelWrapper = SentinelWrapper.wrap(sentinel, await Account.random())
      // using wrapper for archiving
      const values = await sentinelWrapper.report([query])
      const timestamps = values.filter(isTimestamp)
      expect(timestamps.length).toBe(1)
      const thumbnails = values.filter(isImageThumbnail)
      expect(thumbnails.length).toBe(1)
      const thumbnail = thumbnails[0]
      expect(thumbnail.sourceUrl).toBe(url)
      await delay(1000)
      const payloads = await archivist?.all()
      expect(payloads?.length).toBeGreaterThan(0)
    })
  })
})
