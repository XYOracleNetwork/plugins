import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

import { EmailAddressSchema } from './Schema.js'

// TODO: Move to SDK

/**
 * An email type
 */
export type EmailAddressType = `${string}@${string}.${string}`

/**
 * The fields for an email
 */
export interface EmailAddressFields {
  address: EmailAddressType
}

/**
 * The terms of an escrow
 */
export type EmailAddress = PayloadWithSources<EmailAddressFields, EmailAddressSchema>

/**
 * Identity function for determining if an object is an Email
 */
export const isEmailAddress = isPayloadOfSchemaType<EmailAddress>(EmailAddressSchema)

/**
 * Identity function for determining if an object is an Email with sources
 */
export const isEmailAddressWithSources = isPayloadOfSchemaTypeWithSources<EmailAddress>(EmailAddressSchema)

/**
 * Identity function for determining if an object is an Email with meta
 */
export const isEmailAddressWithMeta = isPayloadOfSchemaTypeWithMeta<EmailAddress>(EmailAddressSchema)
