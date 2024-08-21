import type { WitnessConfig } from '@xyo-network/witness-model'

export type FileWitnessConfigSchema = 'network.xyo.file.witness.config'
export const FileWitnessConfigSchema: FileWitnessConfigSchema = 'network.xyo.file.witness.config'

export type FileWitnessConfig = WitnessConfig<{
  schema: FileWitnessConfigSchema
  storage?: 'data-uri'
}>
