import { exists } from '@xylabs/exists'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfigSchema } from '@xyo-network/diviner-model'
import {
  ImageThumbnailResult,
  ImageThumbnailResultFields,
  ImageThumbnailResultSchema,
  isImageThumbnailDivinerQuery,
  isImageThumbnailResultIndex,
} from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, Schema } from '@xyo-network/payload-model'
import { UrlSchema } from '@xyo-network/url-payload-plugin'

import { ImageThumbnailDivinerLabels, ImageThumbnailDivinerStageLabels } from './ImageThumbnailDivinerLabels.ts'

/**
 * Transforms an ImageThumbnailIndex response into an ImageThumbnailResponse response
 */
export class ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner extends AbstractDiviner {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, DivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = DivinerConfigSchema
  static override labels: ImageThumbnailDivinerStageLabels = {
    ...super.labels,
    ...ImageThumbnailDivinerLabels,
    'network.xyo.diviner.stage': 'indexQueryResponseToDivinerQueryResponseDiviner',
  }

  protected override async divineHandler(payloads: Payload[] = []): Promise<ImageThumbnailResult[]> {
    // Filter out the two operands
    const imageThumbnailDivinerQueries = payloads.filter(isImageThumbnailDivinerQuery)
    const imageThumbnailResultIndexes = payloads.filter(isImageThumbnailResultIndex)

    // If we have operands
    if (imageThumbnailDivinerQueries.length > 0 && imageThumbnailResultIndexes.length > 0) {
      // Create a dictionary to translate index keys to the urls that represent them
      const keyToUrlDictionary = Object.fromEntries(
        await Promise.all(
          imageThumbnailDivinerQueries.map(async (imageThumbnailDivinerQuery) => {
            const { url } = imageThumbnailDivinerQuery
            const urlPayload = await new PayloadBuilder<Omit<ImageThumbnailResult, 'timestamp' | 'success' | 'sources'>>({ schema: UrlSchema })
              .fields({ url })
              .build()
            const key = await PayloadBuilder.dataHash(urlPayload)
            return [key, url] as const
          }),
        ),
      )
      // Map the indexes to responses using the dictionary
      return (
        await Promise.all(
          imageThumbnailResultIndexes.map(async (imageThumbnailResultIndex) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { key, schema, ...commonFields } = imageThumbnailResultIndex
            const url = keyToUrlDictionary?.[key]
            if (url) {
              const fields: ImageThumbnailResultFields = { ...commonFields, url }
              return await new PayloadBuilder<ImageThumbnailResult>({ schema: ImageThumbnailResultSchema }).fields(fields).build()
            }
          }),
        )
      ).filter(exists)
    }
    return []
  }
}
