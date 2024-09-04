import type { Payload } from '@xyo-network/payload-model'
import { type Domain, DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH } from '../../Constants.ts'
import {
  domainCasingValidator,
  domainModuleNameValidator,
  domainTldValidator,
  getDomainAllowedHyphensValidator,
  getDomainLengthValidator,
} from '../index.ts'

const baseDomainFields: Payload<Domain> = {
  domain: '',
  tld: 'xyo',
  schema: DomainSchema,
}

describe('XNS Name', () => {
  describe('Validators', () => {
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
        valid: ['abc', 'abcd'],
        invalid: ['', 'a', 'a'.repeat(MAX_DOMAIN_LENGTH + 1)],
      },
    ]

    describe.each(casesLength)('$name', ({ valid, invalid }) => {
      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator()(payload)).toBe(true)
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator()(payload)).toBe(false)
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
