import { WitnessConfig } from '@xyo-network/witness-model'

import { EthereumGasEtherchainV2WitnessConfigSchema } from './Schema.ts'

export type EthereumGasEtherchainV2WitnessConfig = WitnessConfig<{
  schema: EthereumGasEtherchainV2WitnessConfigSchema
}>
