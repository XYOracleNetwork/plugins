import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { DNSWitnessConfig } from './Config.ts'

export type DNSWitnessParams = WitnessParams<AnyConfigSchema<DNSWitnessConfig>>
