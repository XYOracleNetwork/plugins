import type { WitnessConfig } from '@xyo-network/witness-model'

import type { NftWitnessConfigSchema } from './Schema.ts'

export type CryptoWalletNftWitnessConfig = WitnessConfig<{
  address?: string
  loadMetadata?: boolean
  schema: NftWitnessConfigSchema
  timeout?: number
}>
