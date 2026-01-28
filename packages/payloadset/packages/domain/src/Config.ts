import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type DomainWitnessConfigSchema = typeof DomainWitnessConfigSchema
export const DomainWitnessConfigSchema = asSchema('network.xyo.domain.witness.config', true)

export type DomainWitnessConfig = WitnessConfig<{
  domain?: string
  schema: DomainWitnessConfigSchema
}>
