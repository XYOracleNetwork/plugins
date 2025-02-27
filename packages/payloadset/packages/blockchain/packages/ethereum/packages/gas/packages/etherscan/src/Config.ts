import { WitnessConfig } from '@xyo-network/witness-model'

import { EthereumGasEtherscanWitnessConfigSchema } from './Schema.ts'

export type EthereumGasEtherscanWitnessConfig = WitnessConfig<{
  apiKey: string
  schema: EthereumGasEtherscanWitnessConfigSchema
}>
