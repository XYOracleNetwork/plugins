import { EmailAddress, isEmailAddress } from '../Payload.js'
import { EmailAddressSchema } from '../Schema.js'

describe('Email', () => {
  const schema = EmailAddressSchema
  describe('with valid email returns true', () => {
    const validEmails = [
      'john.doe@example.com',
      'jane_smith123@domain.net',
      'contact@company.org',
      'user+name@sub.domain.co',
      'firstname.lastname@company-email.com',
      'my.email@domain.edu',
      'name@domain.travel',
      'support@domain.tech',
      'info@new-domain.info',
      'example@domain.jobs',
      'my-name@domain.gov',
      'name@sub.domain.tld',
    ]
    it.each(validEmails)('%s', (address) => {
      const email: EmailAddress = { address, schema }
      expect(isEmailAddress(email)).toBeTrue()
    })
  })
  describe('with invalid email returns false', () => {
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
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
    it.each(invalidEmails)('%s', (address) => {
      const email: EmailAddress = { address, schema }
      expect(isEmailAddress(email)).toBeFalse()
    })
  })
})
