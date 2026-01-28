import { asSchema } from '@xyo-network/payload-model'

import { NftCollectionSchema } from '../Schema.ts'

export type NftCollectionWitnessConfigSchema = typeof NftCollectionWitnessConfigSchema
export const NftCollectionWitnessConfigSchema = asSchema(`${NftCollectionSchema}.witness.config`, true)

export type NftCollectionWitnessQuerySchema = typeof NftCollectionWitnessQuerySchema
export const NftCollectionWitnessQuerySchema = asSchema(`${NftCollectionSchema}.witness.query`, true)
