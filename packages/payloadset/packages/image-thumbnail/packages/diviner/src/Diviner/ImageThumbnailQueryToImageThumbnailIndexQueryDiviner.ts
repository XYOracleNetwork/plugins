import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfigSchema } from '@xyo-network/diviner-model'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { isImageThumbnailDivinerQuery } from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, Schema } from '@xyo-network/payload-model'
import { UrlSchema } from '@xyo-network/url-payload-plugin'

import { ImageThumbnailDivinerLabels, ImageThumbnailDivinerStageLabels } from './ImageThumbnailDivinerLabels'
import { ImageThumbnailResultQuery } from './ImageThumbnailResultQuery'

/**
 * A diviner that converts ImageThumbnailDivinerQuery to ImageThumbnailResultQuery
 */
export class ImageThumbnailQueryToImageThumbnailIndexQueryDiviner extends AbstractDiviner {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, DivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = DivinerConfigSchema
  static override labels: ImageThumbnailDivinerStageLabels = {
    ...super.labels,
    ...ImageThumbnailDivinerLabels,
    'network.xyo.diviner.stage': 'divinerQueryToIndexQueryDiviner',
  }
  protected override async divineHandler(
    payloads: Payload[] = [],
  ): Promise<Omit<Omit<ImageThumbnailResultQuery, 'timestamp' | 'success'> & Partial<Pick<ImageThumbnailResultQuery, 'success'>>, 'timestamp'>[]> {
    const queries = payloads.filter(isImageThumbnailDivinerQuery)
    if (queries.length > 0) {
      const results = await Promise.all(
        queries.map(async (query) => {
          const { limit: payloadLimit, offset: payloadOffset, order: payloadOrder, status: payloadStatus, success: payloadSuccess, url } = query
          const limit = payloadLimit ?? 1
          const order = payloadOrder ?? 'desc'
          const offset = payloadOffset ?? 0
          const urlPayload = { schema: UrlSchema, url }
          const key = await PayloadBuilder.dataHash(urlPayload)
          const fields: Omit<ImageThumbnailResultQuery, 'schema' | 'timestamp' | 'success'> & Partial<Pick<ImageThumbnailResultQuery, 'success'>> = {
            key,
            limit,
            offset,
            order,
          }
          if (payloadSuccess !== undefined) fields.success = payloadSuccess
          if (payloadStatus !== undefined) fields.status = payloadStatus
          return await new PayloadBuilder<
            Omit<ImageThumbnailResultQuery, 'timestamp' | 'success'> & Partial<Pick<ImageThumbnailResultQuery, 'success'>>
          >({ schema: PayloadDivinerQuerySchema })
            .fields(fields)
            .build()
        }),
      )
      return results
    }
    return []
  }
}
