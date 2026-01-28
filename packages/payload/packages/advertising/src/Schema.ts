import { asSchema } from '@xyo-network/payload-model'

export const AdvertisingSchema = asSchema('network.xyo.advertising', true)
export type AdvertisingSchema = typeof AdvertisingSchema
