import type { Payload } from '@xyo-network/payload-model'
import {
  asSchema, isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { ImageThumbnailSchema } from '../Schema.ts'

export const ImageThumbnailResultSchema = asSchema(`${ImageThumbnailSchema}.result`, true)
export type ImageThumbnailResultSchema = typeof ImageThumbnailResultSchema

/**
 * The result of an image thumbnail witness
 */
export interface ImageThumbnailResultFields {
  /**
   * The HTTP status code of the thumbnail generation request
   */
  status?: number
  /**
   * True for successful thumbnail witnessing, false for failure
   */
  success: boolean
  /**
   * The timestamp of the thumbnail generation request
   */
  timestamp: number
  /**
   * The url of the thumbnail
   */
  url: string
}

/**
 * A payload containing the result of an image thumbnail witness
 */
export type ImageThumbnailResult = Payload<ImageThumbnailResultFields, ImageThumbnailResultSchema>

/**
 * A type guard for ImageThumbnailResult
 */
export const isImageThumbnailResult = isPayloadOfSchemaType<ImageThumbnailResult>(ImageThumbnailResultSchema)

export const isImageThumbnailResultWithSources = isPayloadOfSchemaTypeWithSources<ImageThumbnailResult>(ImageThumbnailResultSchema)
