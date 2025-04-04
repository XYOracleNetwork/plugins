import '@xylabs/vitest-extended'

import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { ImageThumbnail } from '@xyo-network/image-thumbnail-payload-plugin'
import { ImageThumbnailSchema, isImageThumbnailResultIndexWithSources } from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import type { TimeStamp } from '@xyo-network/witness-timestamp'
import { TimestampSchema } from '@xyo-network/witness-timestamp'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner } from '../ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner.ts'

describe('ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner', () => {
  let diviner: ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner
  const timestampA = 1_234_567_890
  const timestampPayloadA: TimeStamp = { schema: TimestampSchema, timestamp: timestampA }
  const imageThumbnailPayloadA: ImageThumbnail = {
    http: { status: 200 },
    schema: ImageThumbnailSchema,
    sourceUrl: 'https://xyo.network',
    url: 'data',
  }
  const timestampB = 1_234_567_891
  const timestampPayloadB: TimeStamp = { schema: TimestampSchema, timestamp: timestampB }
  const imageThumbnailPayloadB: ImageThumbnail = {
    http: { status: 500 },
    schema: ImageThumbnailSchema,
    sourceUrl: 'https://xyo.network',
  }
  const validateResult = async (input: [boundWitness: BoundWitness, thumbnail: ImageThumbnail, timestamp: TimeStamp], result: Payload[]) => {
    const [boundWitness, thumbnail, timestamp] = input
    const payloadDictionary = await PayloadBuilder.toDataHashMap([boundWitness, thumbnail, timestamp])
    expect(result).toBeArrayOfSize(1)
    expect(result.filter(isImageThumbnailResultIndexWithSources)).toBeArrayOfSize(1)
    const index = result.find(isImageThumbnailResultIndexWithSources)
    const key = await PayloadBuilder.dataHash({ schema: UrlSchema, url: thumbnail.sourceUrl })
    expect(index).toBeDefined()
    if (index !== undefined) {
      expect(index.key).toBe(key)
      expect(index.$sources.toSorted()).toEqual(Object.keys(payloadDictionary).toSorted())
      expect(index.success).toBe(thumbnail.http?.status === 200)
      expect(index.timestamp).toBe(timestamp.timestamp)
      expect(index.status).toBe(thumbnail.http?.status)
    }
  }
  beforeAll(async () => {
    diviner = await ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner.create({ account: 'random' })
  })
  describe('divine', () => {
    const cases: [ImageThumbnail, TimeStamp][] = [
      [imageThumbnailPayloadA, timestampPayloadA],
      [imageThumbnailPayloadB, timestampPayloadB],
    ]
    describe('with single result', () => {
      it.each(cases)('transforms single result', async (thumbnail, timestamp) => {
        const [boundWitness] = await (new BoundWitnessBuilder().payloads([thumbnail, timestamp])).build()
        const result = await diviner.divine([boundWitness, thumbnail, timestamp])
        await validateResult([boundWitness, thumbnail, timestamp], result)
      })
      it.each(cases)('handles sparse inputs', async (thumbnail, timestamp) => {
        const [boundWitness] = await (new BoundWitnessBuilder().payloads([thumbnail, timestamp])).build()
        expect(await diviner.divine([thumbnail, timestamp])).toBeArrayOfSize(0)
        expect(await diviner.divine([boundWitness, timestamp])).toBeArrayOfSize(0)
        expect(await diviner.divine([boundWitness, thumbnail])).toBeArrayOfSize(0)
      })
    })
    describe('with multiple results', () => {
      it('transforms multiple results', async () => {
        const data: [BoundWitness, ImageThumbnail, TimeStamp][] = await Promise.all(
          cases.map(async (payloads) => {
            const [bw] = await (new BoundWitnessBuilder().payloads(payloads)).build()
            return [bw, ...payloads]
          }),
        )
        const results = await diviner.divine(data.flat())
        expect(results).toBeArrayOfSize(2)
        await Promise.all(
          data.map(async (input, i) => {
            const result = results[i]
            await validateResult(input, [result])
          }),
        )
      })
      it('handles sparse inputs', async () => {
        const [bw] = await (new BoundWitnessBuilder().payloads(cases[0])).build()
        const results = await diviner.divine([bw, ...cases.flat()])
        expect(results).toBeArrayOfSize(1)
        await validateResult([bw, ...cases[0]], results)
      })
    })
  })
})
