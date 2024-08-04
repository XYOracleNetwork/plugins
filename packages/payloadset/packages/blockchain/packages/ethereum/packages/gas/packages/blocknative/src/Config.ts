import { TimestampWitnessConfig } from '@xyo-network/witness-timestamp'

import { EthereumGasBlocknativeWitnessConfigSchema } from './Schema.ts'

export type EthereumGasBlocknativeWitnessConfig = TimestampWitnessConfig<{
  schema: EthereumGasBlocknativeWitnessConfigSchema
}>
