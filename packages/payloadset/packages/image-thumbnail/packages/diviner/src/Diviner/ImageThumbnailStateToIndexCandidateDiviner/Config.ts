import type { DivinerConfig } from '@xyo-network/diviner-model'
import type { SearchableStorage } from '@xyo-network/image-thumbnail-payload-plugin'
import { asSchema } from '@xyo-network/payload-model'

import { ImageThumbnailStateToIndexCandidateDivinerSchema } from './Schema.ts'

export type ImageThumbnailStateToIndexCandidateDivinerConfigSchema = typeof ImageThumbnailStateToIndexCandidateDivinerConfigSchema
export const ImageThumbnailStateToIndexCandidateDivinerConfigSchema
  = asSchema(`${ImageThumbnailStateToIndexCandidateDivinerSchema}.config`, true)

export type ImageThumbnailStateToIndexCandidateDivinerConfig = DivinerConfig<{
  payloadDivinerLimit?: number
  /**
   * Where the diviner should look for stored thumbnails
   */
  payloadStore?: SearchableStorage
  schema: ImageThumbnailStateToIndexCandidateDivinerConfigSchema
}>
