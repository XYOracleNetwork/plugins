import '@xylabs/vitest-extended'

import type { Hash } from '@xylabs/hex'
import type {
  ImageThumbnailDivinerQuery,
  ImageThumbnailResult,
  ImageThumbnailResultIndex,
} from '@xyo-network/image-thumbnail-payload-plugin'
import {
  ImageThumbnailDivinerQuerySchema,
  ImageThumbnailResultIndexSchema,
  ImageThumbnailResultSchema,
  isImageThumbnailResult,
} from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner }
  from '../ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner.ts'

describe('ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner', () => {
  const queries: ImageThumbnailDivinerQuery[] = [
    {
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://xyo.network',
    },
    {
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://explore.xyo.network',
    },
  ]
  const indexes: ImageThumbnailResultIndex[][] = [
    [
      {
        key: 'setInBeforeAll' as Hash,
        schema: ImageThumbnailResultIndexSchema,
        sources: [],
        status: 200,
        success: true,
        timestamp: 1_234_567_890,
      },
    ],
    [
      {
        key: 'setInBeforeAll' as Hash,
        schema: ImageThumbnailResultIndexSchema,
        sources: [],
        status: 200,
        success: true,
        timestamp: 1_234_567_891,
      },
      {
        key: 'setInBeforeAll' as Hash,
        schema: ImageThumbnailResultIndexSchema,
        sources: [],
        status: 500,
        success: false,
        timestamp: 1_234_567_892,
      },
    ],
  ]
  let diviner: ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner
  beforeAll(async () => {
    diviner = await ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner.create({ account: 'random' })
    await Promise.all(
      queries.map(async (query, i) => {
        await Promise.all(
          indexes[i].map(async (index) => {
            index.key = await PayloadBuilder.dataHash({ schema: UrlSchema, url: query.url })
          }),
        )
      }),
    )
  })
  const cases: [ImageThumbnailDivinerQuery, ImageThumbnailResultIndex[]][] = queries.map((query, i) => [query, indexes[i]])
  describe('divine', () => {
    describe('with single url in index result', () => {
      it.each(cases)('transforms single url index results', async (imageThumbnailDivinerQuery, imageThumbnailResultIndex) => {
        const results = await diviner.divine([imageThumbnailDivinerQuery, ...imageThumbnailResultIndex])
        expect(results).toBeArrayOfSize(imageThumbnailResultIndex.length)
        expect(results.filter(isImageThumbnailResult)).toBeArrayOfSize(imageThumbnailResultIndex.length)
        for (const [i, result] of (results.filter(isImageThumbnailResult) as ImageThumbnailResult[]).entries()) {
          const index = imageThumbnailResultIndex[i]
          expect(result.url).toBe(imageThumbnailDivinerQuery.url)
          expect(result.success).toBe(index.success)
          expect(result.timestamp).toBe(index.timestamp)
          expect(result.status).toBe(index.status)
          expect(result.schema).toBe(ImageThumbnailResultSchema)
        }
      })
    })
    describe('with multiple urls in index result', () => {
      it('transforms multiple url index results', async () => {
        const indexesLength = indexes.flat().length
        const results = await diviner.divine([...queries, ...indexes.flat()])
        expect(results).toBeArrayOfSize(indexesLength)
        const resultsIndexes = results.filter(isImageThumbnailResult) as ImageThumbnailResult[]
        expect(resultsIndexes).toBeArrayOfSize(indexesLength)
        let resultsIterator = 0
        for (const [i, { url }] of queries.entries()) {
          const indexSet = indexes[i]
          for (const index of indexSet) {
            const result = resultsIndexes[resultsIterator]
            expect(result.url).toBe(url)
            expect(result.success).toBe(index.success)
            expect(result.timestamp).toBe(index.timestamp)
            expect(result.status).toBe(index.status)
            expect(result.schema).toBe(ImageThumbnailResultSchema)
            resultsIterator = ++resultsIterator
          }
        }
      })
    })
  })
})
