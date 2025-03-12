import { assertEx } from '@xylabs/assert'
import { AsObjectFactory } from '@xylabs/object'
import type {
  Payload,
  WithSources,
} from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { EmailAddressSchema } from './Schema.ts'

/**
 * A regex for testing if a string is an email
 */
export const emailRegex = /^(?![%+._-])(?!.*\.\.)[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/

/**
 * Tests if a string is a valid email
 * @param email The string to test
 * @returns True if the string is a valid email, false otherwise
 */
export const isValidEmail = (email: string) => {
  return emailRegex.test(email)
}

/**
 * The fields for an email
 */
export interface EmailFields {
  address: string
}

/**
 * An email address
 */
export type Email = Payload<EmailFields, EmailAddressSchema>

/**
 * Tries to create an Email from a string
 * @param address The Email address to use
 * @returns An Email if the address is valid, undefined otherwise
 */
export const tryToEmail = <T = Email | WithSources<Email>>(address: string): T | undefined => {
  return isValidEmail(address) ? ({ address, schema: EmailAddressSchema } as T) : undefined
}

/**
 * Create an Email from a string
 * @param address The Email address to use
 * @returns An Email if the address is valid, throws otherwise
 */
export const toEmail = <T = Email | WithSources<Email>>(address: string): T => {
  return assertEx(tryToEmail<T>(address), () => 'Invalid email address')
}

/**
 * Identity function for determining if an object is an Email
 */
export const isEmail = (value: unknown): value is Email => {
  return isPayloadOfSchemaType<Email>(EmailAddressSchema)(value) && isValidEmail(value.address)
}
export const asEmail = AsObjectFactory.create<Email>(isEmail)
export const asOptionalEmail = AsObjectFactory.createOptional<Email>(isEmail)

/**
 * Identity function for determining if an object is an Email with sources
 */
export const isEmailWithSources = (value: unknown): value is Email => {
  return isPayloadOfSchemaTypeWithSources<Email>(EmailAddressSchema)(value) && isValidEmail(value.address)
}
export const asEmailWithSources = AsObjectFactory.create<Email>(isEmailWithSources)
export const asOptionalEmailWithSources = AsObjectFactory.createOptional<Email>(isEmailWithSources)
