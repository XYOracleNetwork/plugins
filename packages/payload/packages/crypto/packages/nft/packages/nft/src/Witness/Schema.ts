import { asSchema } from '@xyo-network/payload-model'

import { NftSchema } from '../Schema.ts'

export type NftWitnessConfigSchema = typeof NftWitnessConfigSchema
export const NftWitnessConfigSchema = asSchema(`${NftSchema}.witness.config`, true)

export type NftWitnessQuerySchema = typeof NftWitnessQuerySchema
export const NftWitnessQuerySchema = asSchema(`${NftSchema}.witness.query`, true)
