import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { ImageThumbnailDivinerConfig } from './Config.ts'

export type ImageThumbnailDivinerParams = DivinerParams<AnyConfigSchema<ImageThumbnailDivinerConfig>>
