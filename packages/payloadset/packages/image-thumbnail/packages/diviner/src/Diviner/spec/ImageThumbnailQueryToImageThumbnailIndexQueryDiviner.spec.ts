import '@xylabs/vitest-extended'

import type { ImageThumbnailDivinerQuery } from '@xyo-network/image-thumbnail-payload-plugin'
import { ImageThumbnailDivinerQuerySchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { ImageThumbnailQueryToImageThumbnailIndexQueryDiviner } from '../ImageThumbnailQueryToImageThumbnailIndexQueryDiviner.ts'
import type { ImageThumbnailResultQuery } from '../ImageThumbnailResultQuery.ts'
import { isImageThumbnailResultQuery } from '../ImageThumbnailResultQuery.ts'

describe('ImageThumbnailQueryToImageThumbnailIndexQueryDiviner', () => {
  let diviner: ImageThumbnailQueryToImageThumbnailIndexQueryDiviner
  const queries: ImageThumbnailDivinerQuery[] = [
    {
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://xyo.network',
    },
    {
      limit: 10,
      order: 'asc',
      schema: ImageThumbnailDivinerQuerySchema,
      status: 200,
      success: true,
      url: 'https://xyo.network',
    },
    {
      limit: 10,
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://explore.xyo.network',
    },
    {
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://explore.xyo.network',
    },
    {
      order: 'asc',
      schema: ImageThumbnailDivinerQuerySchema,
      url: 'https://explore.xyo.network',
    },
    {
      schema: ImageThumbnailDivinerQuerySchema,
      status: 200,
      url: 'https://explore.xyo.network',
    },
    {
      schema: ImageThumbnailDivinerQuerySchema,
      success: true,
      url: 'https://explore.xyo.network',
    },
    {
      schema: ImageThumbnailDivinerQuerySchema,
      success: false,
      url: 'https://explore.xyo.network',
    },
  ]
  const expected: ImageThumbnailResultQuery[] = [
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 10,
      order: 'asc',
      schema: 'network.xyo.diviner.payload.query',
      status: 200,
      success: true,
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 10,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'asc',
      schema: 'network.xyo.diviner.payload.query',
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
      status: 200,
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
      success: true,
    } as unknown as ImageThumbnailResultQuery,
    {
      key: 'setInBeforeAll',
      limit: 1,
      order: 'desc',
      schema: 'network.xyo.diviner.payload.query',
      success: false,
    } as unknown as ImageThumbnailResultQuery,
  ]
  const cases: [ImageThumbnailDivinerQuery, ImageThumbnailResultQuery][] = queries.map((query, i) => [query, expected[i]])
  beforeAll(async () => {
    diviner = await ImageThumbnailQueryToImageThumbnailIndexQueryDiviner.create({ account: 'random' })

    await Promise.all(
      queries.map(async (query, i) => {
        const key = await PayloadBuilder.dataHash({ schema: UrlSchema, url: query.url })
        expected[i].key = key
      }),
    )
  })
  describe('divine', () => {
    describe('with single query', () => {
      it.each(cases)('transforms query', async (query, expected) => {
        const results = await diviner.divine([query])
        const actual = results.filter(isImageThumbnailResultQuery)
        expect(actual).toBeArrayOfSize(1)
        expect(await PayloadBuilder.dataHash(actual?.[0])).toEqual(await PayloadBuilder.dataHash(expected))
      })
    })
    describe('with multiple queries', () => {
      it('transforms queries', async () => {
        const results = await diviner.divine(queries)
        const actual = results.filter(isImageThumbnailResultQuery)
        expect(actual).toBeArrayOfSize(expected.length)
        expect(await PayloadBuilder.dataHashes(actual)).toEqual(await PayloadBuilder.dataHashes(expected))
      })
    })
  })
})
