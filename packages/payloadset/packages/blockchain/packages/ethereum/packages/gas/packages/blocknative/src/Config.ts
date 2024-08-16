import type { TimestampWitnessConfig } from '@xyo-network/witness-timestamp'

import type { EthereumGasBlocknativeWitnessConfigSchema } from './Schema.ts'

export type EthereumGasBlocknativeWitnessConfig = TimestampWitnessConfig<{
  schema: EthereumGasBlocknativeWitnessConfigSchema
}>
