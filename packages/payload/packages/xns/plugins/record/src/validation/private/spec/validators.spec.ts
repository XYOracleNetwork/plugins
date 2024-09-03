import type { WithSources } from '@xyo-network/payload-model'

import type { DomainRegistration } from '../../../DomainRegistration/index.ts'
import { DomainRegistrationSchema } from '../../../DomainRegistration/index.ts'
import {
  getDomainRegistrationReservedFragmentsValidator, getDomainRegistrationReservedNamesValidator, getDomainRegistrationReservedStringsValidator,
} from '../index.ts'

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
        getValidator: getDomainRegistrationReservedStringsValidator,
        name: 'ReservedStringsValidator',
        reservedList: ['foo'],
        valid: ['bar'],
        invalid: ['foo'],
      },
      {
        getValidator: getDomainRegistrationReservedStringsValidator,
        name: 'ReservedStringsValidator',
        reservedList: [],
        valid: ['bar', 'foobar'],
        invalid: [''],
      },
      {
        getValidator: getDomainRegistrationReservedFragmentsValidator,
        name: 'ReservedFragmentsValidator',
        reservedList: ['foo'],
        valid: ['bar'],
        invalid: ['foobar', 'bar-foo'],
      },
      {
        getValidator: getDomainRegistrationReservedFragmentsValidator,
        name: 'ReservedFragmentsValidator',
        reservedList: [],
        valid: ['foobar', 'bar-foo'],
        invalid: [''],
      },
      {
        getValidator: getDomainRegistrationReservedNamesValidator,
        name: 'ReservedNamesValidator',
        reservedList: ['john doe'],
        valid: ['john1'],
        invalid: ['johndoe', 'doejohn'],
      },
      {
        getValidator: getDomainRegistrationReservedNamesValidator,
        name: 'ReservedNamesValidator',
        reservedList: [],
        valid: ['john', 'doe'],
        invalid: [''],
      },
    ]

    describe.each(cases)('$name', ({
      getValidator, valid, invalid, reservedList,
    }) => {
      const validator = getValidator(reservedList)
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
