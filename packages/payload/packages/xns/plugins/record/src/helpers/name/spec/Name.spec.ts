import type { DomainRegistration } from '../../../DomainRegistration/index.ts'
import { DomainRegistrationSchema } from '../../../DomainRegistration/index.ts'
import { XnsNameHelper } from '../Name.ts'

describe('XnsNameHelper', () => {
  describe('domain getter', () => {
    it('should return the domain if set', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromPayload(domainRegistration)
      expect(helper.domain).toBe('example')
    })

    it('should throw an error if domain is not set', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: '', tld: 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromPayload(domainRegistration)
      expect(() => helper.domain).toThrow('domain not found in payload')
    })
  })

  describe('tld getter', () => {
    it('should return the tld if set', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromPayload(domainRegistration)
      expect(helper.tld).toBe('xyo')
    })

    it('should throw an error if tld is not set', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: '' as 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromPayload(domainRegistration)
      expect(() => helper.tld).toThrow('tld not found in payload')
    })
  })

  describe('xnsName getter', () => {
    it('should return the xnsName if set', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromPayload(domainRegistration)
      expect(helper.xnsName).toBe(domainRegistration)
    })

    it('should throw an error if xnsName is not set', async () => {
      const helper = await XnsNameHelper.fromPayload(undefined as unknown as DomainRegistration)
      expect(() => helper.xnsName).toThrow('XnsNameHelper xnsName not set')
    })
  })

  describe('fromString', () => {
    it('should create an instance from a valid xnsName string', async () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: 'xyo', registrant: [], registrar: [],
      }
      const helper = await XnsNameHelper.fromString('example.xyo')
      expect(helper.xnsName.domain).toBe(domainRegistration.domain)
      expect(helper.xnsName.tld).toBe(domainRegistration.tld)
    })

    it('should throw an error if xnsName string is invalid', async () => {
      await expect(XnsNameHelper.fromString('invalid')).rejects.toThrow('Unable to parse xnsName')
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
    it('should return true for valid xns names', () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example', tld: 'xyo', registrant: [], registrar: [],
      }
      expect(XnsNameHelper.isValid(domainRegistration)).toBe(true)
    })

    it('should return false for invalid xns names', () => {
      const domainRegistration: DomainRegistration = {
        schema: DomainRegistrationSchema, domain: 'example-', tld: 'xyo', registrant: [], registrar: [],
      }
      expect(XnsNameHelper.isValid(domainRegistration)).toBe(false)
    })
  })

  describe('mask', () => {
    const cases = [
      ['Example$123', 'example123'],
      ['Example/123', 'example123'],
      ['Example.123', 'example123'],
      ['Example-123', 'example-123'],
      ['Example 123', 'example123'],
      ['Example_123', 'example123'],
      ['-Example_123-', 'example123'],
      ['-Example_123', 'example123'],
      ['Example_123-', 'example123'],
      ['--Example_123', 'example123'],
      ['Example_123--', 'example123'],
      ['--Example_123--', 'example123'],
      ['- Example_123 -', 'example123'],
    ]

    describe.each(cases)('mask(%s)', (input, expected) => {
      it(`should return ${expected}`, () => {
        expect(XnsNameHelper.mask(input)).toBe(expected)
      })
    })
  })
})
