import { TimestampWitnessConfig } from '@xyo-network/witness-timestamp'

import { EthereumGasBlocknativeWitnessConfigSchema } from './Schema.js'

export type EthereumGasBlocknativeWitnessConfig = TimestampWitnessConfig<{
  schema: EthereumGasBlocknativeWitnessConfigSchema
}>
