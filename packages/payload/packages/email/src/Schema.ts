import { asSchema } from '@xyo-network/payload-model'

/**
 * The schema for an email
 */
export const EmailAddressSchema = asSchema('network.xyo.email.address', true)
export type EmailAddressSchema = typeof EmailAddressSchema
