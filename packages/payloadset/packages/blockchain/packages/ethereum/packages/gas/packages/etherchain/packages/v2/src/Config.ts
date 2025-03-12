import type { WitnessConfig } from '@xyo-network/witness-model'

import type { EthereumGasEtherchainV2WitnessConfigSchema } from './Schema.ts'

export type EthereumGasEtherchainV2WitnessConfig = WitnessConfig<{
  schema: EthereumGasEtherchainV2WitnessConfigSchema
}>
