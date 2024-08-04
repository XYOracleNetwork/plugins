import { WitnessConfig } from '@xyo-network/witness-model'

import { EthereumGasEthersWitnessConfigSchema } from './Schema.ts'

export type EthereumGasEthersWitnessConfig = WitnessConfig<{
  schema: EthereumGasEthersWitnessConfigSchema
}>
