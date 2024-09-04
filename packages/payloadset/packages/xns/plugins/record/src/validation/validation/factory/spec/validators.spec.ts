import type { Domain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import {
  getDomainReservedFragmentsValidator, getDomainReservedNamesValidator, getDomainReservedStringsValidator,
} from '../index.ts'

const baseDomainFields: Domain = {
  domain: '',
  schema: DomainSchema,
  tld: 'xyo',
}

describe('XNS Name', () => {
  describe('Factory Validators', () => {
    const cases = [
      {
        getValidator: getDomainReservedStringsValidator,
        name: 'ReservedStringsValidator',
        reservedList: ['foo'],
        valid: ['bar'],
        invalid: ['foo'],
      },
      {
        getValidator: getDomainReservedStringsValidator,
        name: 'ReservedStringsValidator',
        reservedList: [],
        valid: ['bar', 'foobar'],
        invalid: [''],
      },
      {
        getValidator: getDomainReservedFragmentsValidator,
        name: 'ReservedFragmentsValidator',
        reservedList: ['foo'],
        valid: ['bar'],
        invalid: ['foobar', 'bar-foo'],
      },
      {
        getValidator: getDomainReservedFragmentsValidator,
        name: 'ReservedFragmentsValidator',
        reservedList: [],
        valid: ['foobar', 'bar-foo'],
        invalid: [''],
      },
      {
        getValidator: getDomainReservedNamesValidator,
        name: 'ReservedNamesValidator',
        reservedList: ['john doe'],
        valid: ['john1'],
        invalid: ['johndoe', 'doejohn'],
      },
      {
        getValidator: getDomainReservedNamesValidator,
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
          const payload: Domain = { ...baseDomainFields, domain }
          expect(validator(payload)).toBe(true)
        })
      })
      describe('Invalid', () => {
        it.each(invalid)('should return false for %s', (domain) => {
          if (domain) {
            const payload: Domain = { ...baseDomainFields, domain }
            expect(validator(payload)).toBe(false)
          }
        })
      })
    })
  })
})
