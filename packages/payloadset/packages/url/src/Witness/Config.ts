import { asSchema } from '@xyo-network/payload-model'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

export const UrlWitnessConfigSchema = asSchema(`${UrlSchema}.witness.config`, true)
export type UrlWitnessConfigSchema = typeof UrlWitnessConfigSchema

export type UrlWitnessConfig = WitnessConfig<{
  schema: UrlWitnessConfigSchema
  urls?: string[]
}>
