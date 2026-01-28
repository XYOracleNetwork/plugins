import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type NodeSystemInfoWitnessConfigSchema = typeof NodeSystemInfoWitnessConfigSchema
export const NodeSystemInfoWitnessConfigSchema = asSchema('network.xyo.system.info.witness.node.config', true)

export type NodeSystemInfoWitnessConfig = WitnessConfig<{
  nodeValues?: Record<string, string>
  schema: NodeSystemInfoWitnessConfigSchema
}>
