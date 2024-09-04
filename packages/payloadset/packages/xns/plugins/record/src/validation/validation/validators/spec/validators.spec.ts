/**
 * NOTE: These validators are public because they can be validated by clients
 * and require no special access to private data.
 */

import type { WithSources } from '@xyo-network/payload-model'
import type { DomainRegistration } from '@xyo-network/xns-record-payload-plugins'
import { DomainRegistrationSchema } from '@xyo-network/xns-record-payload-plugins'

import {
  domainCasingValidator,
  domainModuleNameValidator,
  domainTldValidator,
  getDomainAllowedHyphensValidator,
  getDomainLengthValidator,
} from '../index.ts'

const baseDomainRegistrationFields: DomainRegistration = {
  domain: '',
  registrant: [],
  registrar: [],
  schema: DomainRegistrationSchema,
  tld: 'xyo',
}

describe('XNS Name Validators', () => {
  describe('Public Validators', () => {
    const cases = [
      {
        name: 'domainRegistrationCasingValidator',
        validator: domainCasingValidator,
        valid: ['example'],
        invalid: ['Example'],
      },
      {
        name: 'domainRegistrationModuleNameValidator',
        validator: domainModuleNameValidator,
        valid: ['valid-domain'],
        invalid: ['invalid_domain'],
      },
    ]

    describe.each(cases)('$name', ({
      validator, valid, invalid,
    }) => {
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
          expect(validator(domainRegistration)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
          expect(validator(domainRegistration)).toBe(false)
        })
      })
    })

    const casesTld = [
      {
        name: 'domainRegistrationTldValidator',
        valid: ['xyo'],
        invalid: ['com', 'Xyo'],
      },
    ]

    describe.each(casesTld)('$name', ({ valid, invalid }) => {
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (tld) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(domainRegistration)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (tld) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(domainRegistration)).toBe(false)
        })
      })
    })

    const casesLength = [
      {
        name: 'getDomainRegistrationLengthValidator',
        minNameLength: 3,
        valid: ['abc', 'abcd'],
        invalid: ['', 'a'],
      },
    ]

    describe.each(casesLength)('$name', ({
      minNameLength, valid, invalid,
    }) => {
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
          expect(getDomainLengthValidator(minNameLength)(domainRegistration)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
          expect(getDomainLengthValidator(minNameLength)(domainRegistration)).toBe(false)
        })
      })
    })

    const casesHyphens = [
      {
        name: 'getDomainRegistrationAllowedHyphensValidator',
        options: {},
        valid: ['example'],
        invalid: ['example-', '-example', '-example-'],
      },
      {
        name: 'getDomainRegistrationAllowedHyphensValidator',
        options: { start: true },
        valid: ['example', '-example'],
        invalid: ['example-', '-example-'],
      },
      {
        name: 'getDomainRegistrationAllowedHyphensValidator',
        options: { end: true },
        valid: ['example', 'example-'],
        invalid: ['-example', '-example-'],
      },
      {
        name: 'getDomainRegistrationAllowedHyphensValidator',
        options: { start: true, end: true },
        valid: ['example', '-example', 'example-', '-example-'],
        invalid: [''],
      },
    ]

    describe.each(casesHyphens)('$name with $options', ({
      options, valid, invalid,
    }) => {
      const validator = getDomainAllowedHyphensValidator(options)
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
          expect(validator(domainRegistration)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          if (domain) {
            const domainRegistration: WithSources<DomainRegistration> = { ...baseDomainRegistrationFields, domain }
            expect(validator(domainRegistration)).toBe(false)
          } else {
            return true
          }
        })
      })
    })
  })
})
