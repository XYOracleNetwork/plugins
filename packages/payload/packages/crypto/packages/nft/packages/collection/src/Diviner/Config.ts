import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

import { NftCollectionScoreSchema } from './Schema.ts'

export type NftCollectionScoreDivinerConfigSchema = typeof NftCollectionScoreDivinerConfigSchema
export const NftCollectionScoreDivinerConfigSchema = asSchema(`${NftCollectionScoreSchema}.diviner.config`, true)

export type NftCollectionScoreDivinerConfig = DivinerConfig<{ schema: NftCollectionScoreDivinerConfigSchema }>
