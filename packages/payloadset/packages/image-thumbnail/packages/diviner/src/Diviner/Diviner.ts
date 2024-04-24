import { IndexingDiviner } from '@xyo-network/diviner-indexing'
import { AttachableDivinerInstance } from '@xyo-network/diviner-model'

import { ImageThumbnailDivinerLabels } from './ImageThumbnailDivinerLabels'

export class ImageThumbnailDiviner extends IndexingDiviner implements AttachableDivinerInstance {
  static override labels: ImageThumbnailDivinerLabels = { ...super.labels, ...ImageThumbnailDivinerLabels }
}
