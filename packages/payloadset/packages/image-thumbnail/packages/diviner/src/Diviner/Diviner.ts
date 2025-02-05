import { IndexingDiviner } from '@xyo-network/diviner-indexing'
import type { AttachableDivinerInstance } from '@xyo-network/diviner-model'

import { ImageThumbnailDivinerLabels } from './ImageThumbnailDivinerLabels.ts'

export class ImageThumbnailDiviner extends IndexingDiviner implements AttachableDivinerInstance {
  static override readonly labels: ImageThumbnailDivinerLabels = { ...super.labels, ...ImageThumbnailDivinerLabels }
}
