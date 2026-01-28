import { asSchema } from '@xyo-network/payload-model'

export type NodeSystemInfoSchema = typeof NodeSystemInfoSchema
export const NodeSystemInfoSchema = asSchema('network.xyo.system.info.node', true)
