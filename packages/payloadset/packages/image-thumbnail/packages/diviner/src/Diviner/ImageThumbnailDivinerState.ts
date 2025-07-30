import type { StateDictionary } from '@xyo-network/module-model'
import type { Sequence } from '@xyo-network/payload-model'

export type ImageThumbnailDivinerState = StateDictionary & {
  cursor: Sequence
}
