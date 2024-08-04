import { AnyConfigSchema } from '@xyo-network/module-model'
import { WitnessParams } from '@xyo-network/witness-model'

import { UrlWitnessConfig } from './Config.ts'

export type UrlWitnessParams = WitnessParams<AnyConfigSchema<UrlWitnessConfig>>
