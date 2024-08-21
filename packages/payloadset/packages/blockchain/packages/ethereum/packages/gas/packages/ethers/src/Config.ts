import type { WitnessConfig } from '@xyo-network/witness-model'

import type { EthereumGasEthersWitnessConfigSchema } from './Schema.ts'

export type EthereumGasEthersWitnessConfig = WitnessConfig<{
  schema: EthereumGasEthersWitnessConfigSchema
}>
