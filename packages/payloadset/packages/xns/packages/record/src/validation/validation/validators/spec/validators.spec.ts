import type { Payload } from '@xyo-network/payload-model'
import type { Domain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH, MIN_DOMAIN_LENGTH } from '../../Constants.ts'

const baseDomainFields: Payload<Domain> = {
  domain: '',
  tld: 'xyo',
  schema: DomainSchema,
}

import '@xylabs/vitest-extended'

import {
  describe, expect,
  it, vi,
} from 'vitest'

import {
  domainCasingValidator, domainModuleNameValidator, domainTldValidator, getDomainAllowedHyphensValidator, getDomainLengthValidator,
} from '../validators.ts'

describe('XNS Name', () => {
  describe('Validators', () => {
    const cases = [
      {
        name: 'domainCasingValidator',
        validator: domainCasingValidator,
        valid: ['example'],
        invalid: [['Example', ['name must be lowercase']]] as [string, string[]][],
      },
      {
        name: 'domainModuleNameValidator',
        validator: domainModuleNameValidator,
        valid: ['valid-domain'],
        invalid: [['invalid_domain', ['Domain is not a valid module name: invalid_domain']]] as [string, string[]][],
      },
    ]

    describe.each(cases)('$name', ({
      validator, valid, invalid,
    }) => {
      const onErrors = vi.fn()

      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload)).toBe(true)
          expect(onErrors).not.toHaveBeenCalled()
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain, expectedErrorMessage) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload, onErrors)).toBe(false)
          expect(onErrors).toHaveBeenCalledWith(expectedErrorMessage)
        })
      })
    })

    const casesTld = [
      {
        name: 'domainTldValidator',
        valid: ['xyo'],
        invalid: [
          ['com', ['Only XYO TLD currently supported']],
          ['Xyo', ['TLD must be lowercase', 'Only XYO TLD currently supported']],
        ] as [string, string[]][],
      },
    ]

    describe.each(casesTld)('$name', ({ valid, invalid }) => {
      const onErrors = vi.fn()

      describe('Valid', () => {
        it.each(valid)('should return true for %s', (tld) => {
          const payload: Domain = { ...baseDomainFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(payload)).toBe(true)
          expect(onErrors).not.toHaveBeenCalled()
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (tld, expectedErrorMessages) => {
          const payload: Domain = { ...baseDomainFields, tld: tld as unknown as 'xyo' }
          expect(domainTldValidator(payload, onErrors)).toBe(false)
          expect(onErrors).toHaveBeenCalledWith(expectedErrorMessages)
        })
      })
    })

    const casesLength = [
      {
        name: 'getDomainLengthValidator',
        valid: ['abc', 'abcd'],
        invalid: [
          ['', [`name must be at least ${MIN_DOMAIN_LENGTH} characters`]],
          ['a', [`name must be at least ${MIN_DOMAIN_LENGTH} characters`]],
          ['a'.repeat(MAX_DOMAIN_LENGTH + 1), [`name must be no more than ${MAX_DOMAIN_LENGTH} characters`]],
        ] as [string, string[]][],
      },
    ]

    describe.each(casesLength)('$name', ({ valid, invalid }) => {
      const onErrors = vi.fn()

      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator()(payload)).toBe(true)
          expect(onErrors).not.toHaveBeenCalled()
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain, expectedErrorMessage) => {
          const payload: Domain = { ...baseDomainFields, domain }
          expect(getDomainLengthValidator()(payload, onErrors)).toBe(false)
          expect(onErrors).toHaveBeenCalledWith(expectedErrorMessage)
        })
      })
    })

    const startErrorMessage = 'name cannot start with hyphen'
    const endErrorMessage = 'name cannot end with hyphen'
    const casesHyphens = [
      {
        name: 'getDomainAllowedHyphensValidator',
        options: {},
        valid: ['example'],
        invalid: [
          ['example-', [endErrorMessage]],
          ['-example', [startErrorMessage]],
          ['-example-', [startErrorMessage, endErrorMessage]],
        ] as [string, string[]][],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
        options: { start: true },
        valid: ['example', '-example'],
        invalid: [['example-', [endErrorMessage]], ['-example-', [endErrorMessage]]] as [string, string[]][],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
        options: { end: true },
        valid: ['example', 'example-'],
        invalid: [['-example', [startErrorMessage]], ['-example-', [startErrorMessage]]] as [string, string[]][],
      },
      {
        name: 'getDomainAllowedHyphensValidator',
        options: { start: true, end: true },
        valid: ['example', '-example', 'example-', '-example-'],
        invalid: [['', [] as string[]] as [string, string[]]],
      },
    ]

    describe.each(casesHyphens)('$name with $options', ({
      options, valid, invalid,
    }) => {
      const validator = getDomainAllowedHyphensValidator(options)

      describe('Valid', () => {
        it.each(valid)('should return true for %s', (domain) => {
          const payload: Domain = { ...baseDomainFields, domain }
          const onErrors = vi.fn()
          expect(validator(payload)).toBe(true)
          expect(onErrors).not.toHaveBeenCalled()
        })
      })

      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain, expectedErrorMessage) => {
          if (domain) {
            const payload: Domain = { ...baseDomainFields, domain }
            const onErrors = vi.fn()
            expect(validator(payload, onErrors)).toBe(false)
            if (expectedErrorMessage) expect(onErrors).toHaveBeenCalledWith(expectedErrorMessage)
          } else {
            return
          }
        })
      })
    })
  })
})
