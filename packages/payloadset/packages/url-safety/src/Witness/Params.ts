import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { UrlSafetyWitnessConfig } from './Config.ts'

export interface UrlSafetyWitnessParams extends WitnessParams<
  AnyConfigSchema<UrlSafetyWitnessConfig>>
{
  google?: {
    safeBrowsing?: {
      endPoint?: string
      key?: string
    }
  }
}
