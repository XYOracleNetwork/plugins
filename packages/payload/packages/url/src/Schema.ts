import { asSchema } from '@xyo-network/payload-model'

export const UrlSchema = asSchema('network.xyo.url', true)
export type UrlSchema = typeof UrlSchema
