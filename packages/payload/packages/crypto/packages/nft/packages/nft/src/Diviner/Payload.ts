import type { Score } from '@xyo-network/crypto-nft-score-model'
import type { Payload } from '@xyo-network/payload-model'

import type { NftContractInformation } from '../Payload/index.ts'
import { NftScoreSchema } from './Schema.ts'

export type AttributesScoringCriteria = 'Attributes'

export type MetadataScoringCriteria
  = | 'Animation URL'
    | 'Background Color'
    | 'Description'
    | 'External Url'
    | 'Image'
    | 'Image Data'
    | 'Name'
    | 'YouTube URL'
    | AttributesScoringCriteria

export type ScoringCriteria = 'Contract Address' | 'Supply' | 'Token Id' | 'Type' | MetadataScoringCriteria

export type ScoringCriteriaKey = ScoringCriteria & PropertyKey

export type NftAnalysis = {
  [key in ScoringCriteriaKey]: Score
}

export interface NftScores {
  scores: NftAnalysis
}

export type NftScoreFields = NftContractInformation & NftScores & { sources?: string[] }

export type NftScore = Payload<NftScoreFields, NftScoreSchema>
export const isNftScore = (x?: Payload | null): x is NftScore => x?.schema === NftScoreSchema
