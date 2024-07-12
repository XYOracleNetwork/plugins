import { WitnessConfig } from '@xyo-network/witness-model'

import { EthereumGasEthersWitnessConfigSchema } from './Schema.js'

export type EthereumGasEthersWitnessConfig = WitnessConfig<{
  schema: EthereumGasEthersWitnessConfigSchema
}>
