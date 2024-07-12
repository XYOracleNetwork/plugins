import { WitnessConfig } from '@xyo-network/witness-model'

import { EthereumGasEtherscanWitnessConfigSchema } from './Schema.js'

export type EthereumGasEtherscanWitnessConfig = WitnessConfig<{
  apiKey: string
  schema: EthereumGasEtherscanWitnessConfigSchema
}>
