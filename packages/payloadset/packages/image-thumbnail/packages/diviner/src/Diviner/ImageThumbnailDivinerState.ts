import type { Hex } from '@xylabs/hex'
import type { StateDictionary } from '@xyo-network/module-model'

export type ImageThumbnailDivinerState = StateDictionary & {
  cursor: Hex
}
