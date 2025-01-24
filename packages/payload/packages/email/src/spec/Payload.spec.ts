import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import type { Email } from '../Payload.ts'
import {
  asEmail, isEmail, tryToEmail,
} from '../Payload.ts'
import { EmailAddressSchema } from '../Schema.ts'

describe('Email', () => {
  const schema = EmailAddressSchema
  const validEmails = [
    'john.doe@example.com',
    'jane_smith123@domain.net',
    'contact@company.org',
    'user+name@sub.domain.co',
    'first.last@company-email.com',
    'my.email@domain.edu',
    'name@domain.travel',
    'support@domain.tech',
    'info@new-domain.info',
    'example@domain.jobs',
    'my-name@domain.gov',
    'name@sub.domain.tld',
  ]
  const invalidEmails = [
    'string',
    '@username.com',
    'username@.com',
    'username@domain..com',
    'username@domain.c',
    'username@domain,com',
    'username@domain..co',
    'user name@domain.com',
    'username@domain@domain.com',
    '.username@domain.com',
    'username@domain.com.',
    'username@domain..com',
  ]
  describe('isEmail', () => {
    describe('with valid email returns true', () => {
      it.each(validEmails)('%s', (address) => {
        const email: Email = { address, schema }
        expect(isEmail(email)).toBeTrue()
      })
    })
    describe('with invalid email returns false', () => {
      it.each(invalidEmails)('%s', (address) => {
        const email: Email = { address, schema }
        expect(isEmail(email)).toBeFalse()
      })
    })
  })
  describe('tryToEmail', () => {
    describe('with valid email returns payload', () => {
      it.each(validEmails)('%s', (address) => {
        expect(tryToEmail(address)).toBeObject()
      })
    })
    describe('with invalid email returns undefined', () => {
      it.each(invalidEmails)('%s', (address) => {
        expect(tryToEmail(address)).toBeUndefined()
      })
    })
  })
  describe('asEmail', () => {
    describe('with valid email returns Email', () => {
      it.each(validEmails)('%s', (address) => {
        const email: Email = { address, schema }
        expect(asEmail(email)).toBeObject()
      })
    })
    describe('with invalid email returns false', () => {
      it.each(invalidEmails)('%s', (address) => {
        const email: Email = { address, schema }
        expect(asEmail(email)).toBeUndefined()
      })
    })
  })
})
