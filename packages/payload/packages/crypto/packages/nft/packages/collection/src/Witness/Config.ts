import { WitnessConfig } from '@xyo-network/witness-model'

import { NftCollectionWitnessConfigSchema } from './Schema.js'

export type NftCollectionWitnessConfig = WitnessConfig<{
  address?: string
  chainId?: number
  schema: NftCollectionWitnessConfigSchema
}>
