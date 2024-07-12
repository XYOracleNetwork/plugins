import { WitnessConfig } from '@xyo-network/witness-model'

import { NftWitnessConfigSchema } from './Schema.js'

export type CryptoWalletNftWitnessConfig = WitnessConfig<{
  address?: string
  loadMetadata?: boolean
  schema: NftWitnessConfigSchema
  timeout?: number
}>
