import { asSchema } from '@xyo-network/payload-model'

import { NftCollectionSchema } from '../Schema.ts'

export type NftCollectionScoreSchema = typeof NftCollectionScoreSchema
export const NftCollectionScoreSchema = asSchema(`${NftCollectionSchema}.score`, true)
