import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import type { ImageThumbnailResultFields } from './ImageThumbnailResult.ts'
import { ImageThumbnailResultSchema } from './ImageThumbnailResult.ts'

export const ImageThumbnailResultIndexSchema = `${ImageThumbnailResultSchema}.index` as const
export type ImageThumbnailResultIndexSchema = typeof ImageThumbnailResultIndexSchema

/**
 * An index which is keyed by a hash. Used to create uniformity in the way
 * we index data (key length, character set, etc).
 */
export type HashKeyedIndex<T> = T & {
  /**
   * The key for the index. Should be a hash of the relevant identifying data.
   */
  key: Hash
}

/**
 * The hash-keyed index of an ImageThumbnailResult
 */
export type ImageThumbnailResultIndexFields = HashKeyedIndex<Omit<ImageThumbnailResultFields, 'url'>>

/**
 * A payload containing the hash-keyed index of an ImageThumbnailResult
 */
export type ImageThumbnailResultIndex = Payload<ImageThumbnailResultIndexFields, ImageThumbnailResultIndexSchema>

/**
 * A type guard for ImageThumbnailResultIndex
 */
export const isImageThumbnailResultIndex = isPayloadOfSchemaType<ImageThumbnailResultIndex>(ImageThumbnailResultIndexSchema)

export const isImageThumbnailResultIndexWithSources = isPayloadOfSchemaTypeWithSources<ImageThumbnailResultIndex>(ImageThumbnailResultIndexSchema)
