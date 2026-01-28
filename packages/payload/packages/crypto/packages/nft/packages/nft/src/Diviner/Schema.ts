import { asSchema } from '@xyo-network/payload-model'

import { NftSchema } from '../Schema.ts'

export type NftScoreSchema = typeof NftScoreSchema
export const NftScoreSchema = asSchema(`${NftSchema}.score`, true)
