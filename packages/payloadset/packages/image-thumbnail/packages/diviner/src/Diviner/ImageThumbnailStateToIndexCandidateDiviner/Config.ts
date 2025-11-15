import type { DivinerConfig } from '@xyo-network/diviner-model'
import type { SearchableStorage } from '@xyo-network/image-thumbnail-payload-plugin'

import { ImageThumbnailStateToIndexCandidateDivinerSchema } from './Schema.ts'

export type ImageThumbnailStateToIndexCandidateDivinerConfigSchema = `${ImageThumbnailStateToIndexCandidateDivinerSchema}.config`
export const ImageThumbnailStateToIndexCandidateDivinerConfigSchema: ImageThumbnailStateToIndexCandidateDivinerConfigSchema
  = `${ImageThumbnailStateToIndexCandidateDivinerSchema}.config`

export type ImageThumbnailStateToIndexCandidateDivinerConfig = DivinerConfig<{
  payloadDivinerLimit?: number
  /**
   * Where the diviner should look for stored thumbnails
   */
  payloadStore?: SearchableStorage
  schema: ImageThumbnailStateToIndexCandidateDivinerConfigSchema
}>
