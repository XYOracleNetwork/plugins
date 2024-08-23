import type { Hash } from '@xylabs/hex'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfigSchema } from '@xyo-network/diviner-model'
import type {
  ImageThumbnail,
  ImageThumbnailResultIndex,
  ImageThumbnailResultIndexFields,
} from '@xyo-network/image-thumbnail-payload-plugin'
import {
  ImageThumbnailResultIndexSchema,
  ImageThumbnailSchema,
  isImageThumbnail,
} from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type {
  Payload, Schema, WithMeta, WithSources,
} from '@xyo-network/payload-model'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import type { TimeStamp } from '@xyo-network/witness-timestamp'
import { isTimestamp, TimestampSchema } from '@xyo-network/witness-timestamp'

import type { ImageThumbnailDivinerStageLabels } from './ImageThumbnailDivinerLabels.ts'
import { ImageThumbnailDivinerLabels } from './ImageThumbnailDivinerLabels.ts'

/**
 * Transforms candidates for image thumbnail indexing into their indexed representation
 */
export class ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner extends AbstractDiviner {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, DivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = DivinerConfigSchema
  static override labels: ImageThumbnailDivinerStageLabels = {
    ...super.labels,
    ...ImageThumbnailDivinerLabels,
    'network.xyo.diviner.stage': 'indexCandidateToIndexDiviner',
  }

  protected override async divineHandler(payloads: Payload[] = []): Promise<WithSources<ImageThumbnailResultIndex>[]> {
    const bws: BoundWitness[] = payloads.filter(isBoundWitness)
    const imageThumbnailPayloads: ImageThumbnail[] = payloads.filter(isImageThumbnail)
    const timestampPayloads: TimeStamp[] = payloads.filter(isTimestamp)
    if (bws.length > 0 && imageThumbnailPayloads.length > 0 && timestampPayloads.length > 0) {
      const payloadDictionary = await PayloadBuilder.toDataHashMap(payloads)
      // eslint-disable-next-line unicorn/no-array-reduce
      const tuples: [BoundWitness, ImageThumbnail, TimeStamp][] = bws.reduce<[BoundWitness, ImageThumbnail, TimeStamp][]>(
        (acc, curr) => {
          const imageThumbnailIndex = curr.payload_schemas?.findIndex(schema => schema === ImageThumbnailSchema)
          const timestampIndex = curr.payload_schemas?.findIndex(schema => schema === TimestampSchema)
          const imageThumbnailHash = curr.payload_hashes?.[imageThumbnailIndex]
          const timestampHash = curr.payload_hashes?.[timestampIndex]
          const imageThumbnailPayload = [payloadDictionary[imageThumbnailHash]].find(isImageThumbnail) as WithMeta<ImageThumbnail> | undefined
          const timestampPayload = [payloadDictionary[timestampHash]].find(isTimestamp) as WithMeta<TimeStamp>
          if (imageThumbnailPayload && timestampPayload) acc.push([curr, imageThumbnailPayload, timestampPayload])
          return acc
        },
        [] as [BoundWitness, ImageThumbnail, TimeStamp][],
      )
      const indexes = await Promise.all(
        tuples.map(async ([bw, imageThumbnailPayload, timestampPayload]) => {
          const { sourceUrl: url, http } = imageThumbnailPayload
          const { timestamp } = timestampPayload
          const { status } = http ?? {}
          const success = !!imageThumbnailPayload.url // Call anything with a thumbnail url a success
          const sources: Hash[] = await PayloadBuilder.dataHashes([bw, imageThumbnailPayload, timestampPayload])
          const urlPayload = { schema: UrlSchema, url }
          const key: Hash = await PayloadBuilder.dataHash(urlPayload)
          const fields: ImageThumbnailResultIndexFields = {
            key, sources, success, timestamp,
          }
          if (status) fields.status = status
          const result = await new PayloadBuilder<WithSources<ImageThumbnailResultIndex>>({ schema: ImageThumbnailResultIndexSchema })
            .fields(fields)
            .build()
          return [result]
        }),
      )
      return indexes.flat()
    }
    return []
  }
}
