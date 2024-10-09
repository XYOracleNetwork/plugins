import type { Domain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH } from '../../validation/index.ts'
import { XnsNameHelper } from '../Name.ts'

describe('XnsNameHelper', () => {
  const validDomain: Domain = {
    schema: DomainSchema, domain: 'example', tld: 'xyo',
  }
  describe('domain getter', () => {
    it('should return the domain if set', async () => {
      const helper = await XnsNameHelper.fromPayload(validDomain)
      expect(helper.domain).toBe('example')
    })

    it('should throw an error if domain is not set', async () => {
      const domain: Domain = {
        schema: DomainSchema, domain: '', tld: 'xyo',
      }
      const helper = await XnsNameHelper.fromPayload(domain)
      expect(() => helper.domain).toThrow('domain not found in payload')
    })
  })

  describe('tld getter', () => {
    it('should return the tld if set', async () => {
      const helper = await XnsNameHelper.fromPayload(validDomain)
      expect(helper.tld).toBe('xyo')
    })

    it('should throw an error if tld is not set', async () => {
      const domain: Domain = {
        schema: DomainSchema, domain: 'example', tld: '' as 'xyo',
      }
      const helper = await XnsNameHelper.fromPayload(domain)
      expect(() => helper.tld).toThrow('tld not found in payload')
    })
  })

  describe('xnsName getter', () => {
    it('should return the xnsName if set', async () => {
      const helper = await XnsNameHelper.fromPayload(validDomain)
      expect(helper.xnsName).toEqual(validDomain)
    })

    it('should throw an error if xnsName is not set', async () => {
      const helper = await XnsNameHelper.fromPayload(undefined as unknown as Domain)
      expect(() => helper.xnsName).toThrow('XnsNameHelper xnsName not set')
    })
  })

  describe('fromString', () => {
    it('should create an instance from a valid xnsName string', () => {
      const { domain, tld } = validDomain
      const helper = XnsNameHelper.fromString(`${domain}.${tld}`)
      expect(helper.domain).toBe(domain)
      expect(helper.xnsName.domain).toBe(domain)
      expect(helper.tld).toBe(tld)
      expect(helper.xnsName.tld).toBe(tld)
    })

    it('should throw an error if xnsName string is invalid', () => {
      expect(() => XnsNameHelper.fromString('invalid')).toThrow('Unable to parse xnsName')
    })
  })

  describe('isXnsNameOrHash', () => {
    it('should return "xnsName" if the source ends with a valid TLD', () => {
      expect(XnsNameHelper.isPotentialXnsNameOrHash('example.xyo')).toBe('xnsName')
    })

    it('should return "hash" if the source is a valid hash', () => {
      expect(XnsNameHelper.isPotentialXnsNameOrHash('c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2')).toBe('hash')
    })

    it('should return null if the source is neither a valid xnsName nor a hash', () => {
      expect(XnsNameHelper.isPotentialXnsNameOrHash('invalid')).toBe(null)
    })
  })

  describe('isValid', () => {
    it('should return true for valid xns names', async () => {
      expect(await XnsNameHelper.isValid(validDomain)).toBe(true)
    })

    it('should return false for invalid xns names', async () => {
      const domain: Domain = {
        schema: DomainSchema, domain: 'example-', tld: 'xyo',
      }
      expect(await XnsNameHelper.isValid(domain)).toBe(false)
    })
  })

  describe('mask', () => {
    describe('with invalid input', () => {
      it('should throw an error', () => {
        expect(() => XnsNameHelper.mask('a'.repeat(MAX_DOMAIN_LENGTH + 1)))
          .toThrow('Domain name too long: 129 exceeds max length: 128')
      })
    })

    const cases = [
      ['Example$123', 'example123'],
      ['Example/123', 'example123'],
      ['Example.123', 'example123'],
      ['Example-123', 'example-123'],
      ['Example 123', 'example123'],
      ['Example_123', 'example123'],
      ['Example-123', 'example-123'],
    ]

    describe.each(cases)('mask(%s)', (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(XnsNameHelper.mask(input)).toBe(expected)
      })
    })

    describe('with options', () => {
      const options = { maskStartEndHyphens: true }
      const cases = [
        ['-Example_123-', 'example123'],
        ['-Example_123', 'example123'],
        ['Example_123-', 'example123'],
        ['--Example_123', 'example123'],
        ['Example_123--', 'example123'],
        ['--Example_123--', 'example123'],
        ['- Example_123 -', 'example123'],
      ]

      describe('stripDashes: true', () => {
        describe.each(cases)('mask(%s)', (input, expected) => {
          it(`should return ${expected}`, () => {
            expect(XnsNameHelper.mask(input, options)).toBe(expected)
          })
        })
      })
    })
  })

  describe('validate', () => {
    it('should validate and return errors', async () => {
      const helper = XnsNameHelper.fromString('Example.Xyo')
      const [valid, errors] = await helper.validate()
      expect(valid).toBe(false)
      expect(errors).toEqual(['name must be lowercase', 'TLD must be lowercase', 'Only XYO TLD currently supported'])
    })
  })
})
