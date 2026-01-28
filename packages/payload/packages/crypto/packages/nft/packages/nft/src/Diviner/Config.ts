import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

import { NftScoreSchema } from './Schema.ts'

export type NftScoreDivinerConfigSchema = typeof NftScoreDivinerConfigSchema
export const NftScoreDivinerConfigSchema = asSchema(`${NftScoreSchema}.diviner.config`, true)

export type NftScoreDivinerConfig = DivinerConfig<{ schema: NftScoreDivinerConfigSchema }>
