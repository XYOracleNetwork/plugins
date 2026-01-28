import { asSchema } from '@xyo-network/payload-model'

export type DNSSchema = typeof DNSSchema
export const DNSSchema = asSchema('network.xyo.dns', true)
