import { asSchema } from '@xyo-network/payload-model'

export const UrlSafetySchema = asSchema('network.xyo.url.safety', true)
export type UrlSafetySchema = typeof UrlSafetySchema
