import { asSchema } from '@xyo-network/payload-model'

export type ElevationSchema = typeof ElevationSchema
export const ElevationSchema = asSchema('network.xyo.elevation', true)
