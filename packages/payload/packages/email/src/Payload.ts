import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

import { EmailAddressSchema } from './Schema.js'

/**
 * An email type
 */
export type EmailAddressType = `${string}@${string}.${string}`

/**
 * A regex for testing if a string is an email
 */
export const emailRegex = /^(?!.*\.\.)[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/

/**
 * Tests if a string is a valid email
 * @param email The string to test
 * @returns True if the string is a valid email, false otherwise
 */
export const isValidEmail = (email: string): email is EmailAddressType => {
  return emailRegex.test(email)
}

/**
 * The fields for an email
 */
export interface EmailAddressFields {
  address: EmailAddressType | string
}

/**
 * The terms of an escrow
 */
export type EmailAddress = PayloadWithSources<EmailAddressFields, EmailAddressSchema>

/**
 * Identity function for determining if an object is an Email
 */
export const isEmailAddress = (value: unknown): value is EmailAddress => {
  return isPayloadOfSchemaType<EmailAddress>(EmailAddressSchema)(value) && isValidEmail(value.address)
}

/**
 * Identity function for determining if an object is an Email with sources
 */
export const isEmailAddressWithSources = (value: unknown): value is EmailAddress => {
  return isPayloadOfSchemaTypeWithSources<EmailAddress>(EmailAddressSchema)(value) && isValidEmail(value.address)
}

/**
 * Identity function for determining if an object is an Email with meta
 */
export const isEmailAddressWithMeta = (value: unknown): value is EmailAddress => {
  return isPayloadOfSchemaTypeWithMeta<EmailAddress>(EmailAddressSchema)(value) && isValidEmail(value.address)
}
