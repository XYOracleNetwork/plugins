import type { WithSources } from '@xyo-network/payload-model'

import type { DomainRegistration } from '../../../DomainRegistration/index.ts'
import { DomainRegistrationSchema } from '../../../DomainRegistration/index.ts'
import { getDomainRegistrationReservedStringsValidator } from '../index.ts'

const baseDomainRegistrationFields: DomainRegistration = {
  domain: '',
  registrant: [],
  registrar: [],
  schema: DomainRegistrationSchema,
  tld: 'xyo',
}

describe('XNS Name Validators', () => {
  describe('Private Validators', () => {
    const cases = [
      {
        name: 'ReservedStringsValidator',
        reservedStrings: ['foo'],
        valid: ['bar'],
        invalid: ['foo'],
      },
      {
        name: 'ReservedStringsValidator',
        reservedStrings: [],
        valid: ['bar', 'foobar'],
        invalid: [''],
      },
    ]

    describe.each(cases)('$name', ({
      valid, invalid, reservedStrings,
    }) => {
      const validator = getDomainRegistrationReservedStringsValidator(reservedStrings)
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
            expect(true).toBe(true)
          }
        })
      })
    })
  })
})
