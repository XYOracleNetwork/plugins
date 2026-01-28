import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type FileWitnessConfigSchema = typeof FileWitnessConfigSchema
export const FileWitnessConfigSchema = asSchema('network.xyo.file.witness.config', true)

export type FileWitnessConfig = WitnessConfig<{
  schema: FileWitnessConfigSchema
  storage?: 'data-uri'
}>
