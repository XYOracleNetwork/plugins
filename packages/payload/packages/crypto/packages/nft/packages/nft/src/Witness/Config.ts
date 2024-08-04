import { WitnessConfig } from '@xyo-network/witness-model'

import { NftWitnessConfigSchema } from './Schema.ts'

export type CryptoWalletNftWitnessConfig = WitnessConfig<{
  address?: string
  loadMetadata?: boolean
  schema: NftWitnessConfigSchema
  timeout?: number
}>
