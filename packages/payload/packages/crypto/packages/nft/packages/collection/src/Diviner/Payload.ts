import { Hash } from '@xylabs/hex'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, Payload } from '@xyo-network/payload-model'

import { NftCollectionMetadata } from '../Payload/index.ts'
import { NftCollectionScoreSchema } from './Schema.ts'

export type NftCollectionAnalysis = Record<string, [score: number, total: number]>

export interface NftCollectionScores {
  scores: NftCollectionAnalysis
}

export type NftCollectionScoreFields = NftCollectionMetadata & NftCollectionScores & { sources?: Hash[] }

export type NftCollectionScore = Payload<NftCollectionScoreFields, NftCollectionScoreSchema>
export const isNftCollectionScore = isPayloadOfSchemaType<NftCollectionScore>(NftCollectionScoreSchema)
export const isNftCollectionScoreWithMeta = isPayloadOfSchemaTypeWithMeta<NftCollectionScore>(NftCollectionScoreSchema)
