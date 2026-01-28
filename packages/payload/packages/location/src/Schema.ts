import { asSchema } from '@xyo-network/payload-model'

export type CurrentLocationSchema = typeof CurrentLocationSchema
export const CurrentLocationSchema = asSchema('network.xyo.location.current', true)
