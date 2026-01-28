import { asSchema } from '@xyo-network/payload-model'

export type AbstractModuleInstanceSchema = typeof AbstractModuleInstanceSchema
export const AbstractModuleInstanceSchema = asSchema('network.xyo.module.instance', true)
