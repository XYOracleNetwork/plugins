import { AnyConfigSchema } from '@xyo-network/module-model'
import { WitnessParams } from '@xyo-network/witness-model'

import { UrlSafetyWitnessConfig } from './Config.ts'

export type UrlSafetyWitnessParams = WitnessParams<
  AnyConfigSchema<UrlSafetyWitnessConfig>,
  {
    google?: {
      safeBrowsing?: {
        endPoint?: string
        key?: string
      }
    }
  }
>
