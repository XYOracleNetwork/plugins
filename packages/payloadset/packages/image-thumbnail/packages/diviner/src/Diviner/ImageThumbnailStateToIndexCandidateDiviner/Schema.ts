import { ImageThumbnailDivinerSchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { asSchema } from '@xyo-network/payload-model'

export type ImageThumbnailStateToIndexCandidateDivinerSchema = typeof ImageThumbnailStateToIndexCandidateDivinerSchema
export const ImageThumbnailStateToIndexCandidateDivinerSchema
  = asSchema(`${ImageThumbnailDivinerSchema}.stage.stateToIndexCandidateDiviner`, true)
