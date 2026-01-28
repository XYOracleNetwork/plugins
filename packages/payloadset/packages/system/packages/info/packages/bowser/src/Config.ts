import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type BowserSystemInfoWitnessConfigSchema = typeof BowserSystemInfoWitnessConfigSchema
export const BowserSystemInfoWitnessConfigSchema = asSchema('network.xyo.system.info.witness.bowser.config', true)

export type BowserSystemInfoWitnessConfig = WitnessConfig<{
  schema: BowserSystemInfoWitnessConfigSchema
}>
