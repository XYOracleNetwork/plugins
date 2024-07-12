import { DivinerConfig } from '@xyo-network/diviner-model'

import { NftCollectionScoreSchema } from './Schema.js'

export type NftCollectionScoreDivinerConfigSchema = `${NftCollectionScoreSchema}.diviner.config`
export const NftCollectionScoreDivinerConfigSchema: NftCollectionScoreDivinerConfigSchema = `${NftCollectionScoreSchema}.diviner.config`

export type NftCollectionScoreDivinerConfig = DivinerConfig<{ schema: NftCollectionScoreDivinerConfigSchema }>
