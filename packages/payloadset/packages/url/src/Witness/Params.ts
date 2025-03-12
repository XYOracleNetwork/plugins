import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { UrlWitnessConfig } from './Config.ts'

export type UrlWitnessParams = WitnessParams<AnyConfigSchema<UrlWitnessConfig>>
