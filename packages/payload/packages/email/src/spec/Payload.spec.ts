import {} from '../Payload.js'

describe('Email', () => {
  describe('with valid email', () => {
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
    it('with valid email', () => {
      //
    })
  })
  describe('with invalid email', () => {
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
    it('with valid email', () => {
      //
    })
  })
})
