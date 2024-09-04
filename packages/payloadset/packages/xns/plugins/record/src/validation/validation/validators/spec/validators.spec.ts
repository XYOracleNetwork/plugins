/**
 * NOTE: These validators are public because they can be validated by clients
 * and require no special access to private data.
 */

import type { Domain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import {
  domainCasingValidator,
  domainModuleNameValidator,
  domainTldValidator,
  getDomainAllowedHyphensValidator,
  getDomainLengthValidator,
} from '../index.ts'

const baseDomainFields: Domain = {
  domain: '',
  schema: DomainSchema,
  tld: 'xyo',
}

describe('XNS Name Validators', () => {
  describe('Public Validators', () => {
    const cases = [
      {
        name: 'domainCasingValidator',
        validator: domainCasingValidator,
        valid: ['example'],
        invalid: ['Example'],
      },
      {
        name: 'domainModuleNameValidator',
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
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload)).toBe(false)
        })
      })
    })

    const casesTld = [
      {
        name: 'domainTldValidator',
        valid: ['xyo'],
        invalid: ['com', 'Xyo'],
      },
    ]

    describe.each(casesTld)('$name', ({ valid, invalid }) => {
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (tld) => {
          const payload: Domain = { ...baseDomainFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(payload)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (tld) => {
          const payload: Domain = { ...baseDomainFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(payload)).toBe(false)
        })
      })
    })

    const casesLength = [
      {
        name: 'getDomainLengthValidator',
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
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator(minNameLength)(payload)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator(minNameLength)(payload)).toBe(false)
        })
      })
    })

    const casesHyphens = [
      {
        name: 'getDomainAllowedHyphensValidator',
        options: {},
        valid: ['example'],
        invalid: ['example-', '-example', '-example-'],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
        options: { start: true },
        valid: ['example', '-example'],
        invalid: ['example-', '-example-'],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
        options: { end: true },
        valid: ['example', 'example-'],
        invalid: ['-example', '-example-'],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
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
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          if (domain) {
            const payload: Domain = { ...baseDomainFields, domain }
            expect(validator(payload)).toBe(false)
          } else {
            return true
          }
        })
      })
    })
  })
})
