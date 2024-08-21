import type { WitnessConfig } from '@xyo-network/witness-model'

import type { EthereumGasEtherscanWitnessConfigSchema } from './Schema.ts'

export type EthereumGasEtherscanWitnessConfig = WitnessConfig<{
  apiKey: string
  schema: EthereumGasEtherscanWitnessConfigSchema
}>
