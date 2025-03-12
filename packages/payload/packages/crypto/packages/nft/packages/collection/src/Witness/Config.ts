import type { WitnessConfig } from '@xyo-network/witness-model'

import type { NftCollectionWitnessConfigSchema } from './Schema.ts'

export type NftCollectionWitnessConfig = WitnessConfig<{
  address?: string
  chainId?: number
  schema: NftCollectionWitnessConfigSchema
}>
