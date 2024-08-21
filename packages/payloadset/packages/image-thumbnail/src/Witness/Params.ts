import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { ImageThumbnailWitnessConfig } from './Config.ts'

export type ImageThumbnailWitnessParams = WitnessParams<
  AnyConfigSchema<ImageThumbnailWitnessConfig>,
  {
    loaders?: string[]
  }
>
