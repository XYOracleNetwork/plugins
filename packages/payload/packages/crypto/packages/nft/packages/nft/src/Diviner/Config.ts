import type { DivinerConfig } from '@xyo-network/diviner-model'

import { NftScoreSchema } from './Schema.ts'

export type NftScoreDivinerConfigSchema = `${NftScoreSchema}.diviner.config`
export const NftScoreDivinerConfigSchema: NftScoreDivinerConfigSchema = `${NftScoreSchema}.diviner.config`

export type NftScoreDivinerConfig = DivinerConfig<{ schema: NftScoreDivinerConfigSchema }>
