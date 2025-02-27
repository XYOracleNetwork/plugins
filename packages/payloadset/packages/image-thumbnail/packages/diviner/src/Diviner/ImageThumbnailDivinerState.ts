import { Hex } from '@xylabs/hex'
import { StateDictionary } from '@xyo-network/module-model'

export type ImageThumbnailDivinerState = StateDictionary & {
  cursor: Hex
}
