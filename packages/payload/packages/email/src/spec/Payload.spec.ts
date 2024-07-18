import { asEmail, Email, isEmail, tryAsEmail } from '../Payload.js'
import { EmailAddressSchema } from '../Schema.js'

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
  describe('tryAsEmail', () => {
    describe('with valid email returns payload', () => {
      it.each(validEmails)('%s', (address) => {
        expect(tryAsEmail(address)).toBeObject()
      })
    })
    describe('with invalid email returns undefined', () => {
      it.each(invalidEmails)('%s', (address) => {
        expect(tryAsEmail(address)).toBeUndefined()
      })
    })
  })
  describe('asEmail', () => {
    describe('with valid email returns Email', () => {
      it.each(validEmails)('%s', (address) => {
        expect(asEmail(address)).toBeObject()
      })
    })
    describe('with invalid email returns false', () => {
      it.each(invalidEmails)('%s', (address) => {
        expect(() => asEmail(address)).toThrow('Invalid email address')
      })
    })
  })
})
