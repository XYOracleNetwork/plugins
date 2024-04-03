import { Address } from '@xylabs/hex'
import { ModuleIdentifier } from '@xyo-network/module-model'

import { EscrowTerms, EscrowTermsSchema } from '../../../../Terms'
import { moduleIdentifiersContainsOneOf } from '../moduleInstanceValidators'

describe('RegistrarSentinel', () => {
  const appraisalAuthority1: Address = 'address1'
  const appraisalAuthority2: Address = 'address2'
  const buyer1: Address = 'address3'
  const escrowAgent: Address = 'address4'
  const paymentAuthority1: Address = 'address5'
  const seller1: Address = 'address6'
  const escrowTermsExample: EscrowTerms = {
    appraisalAuthorities: [appraisalAuthority1, appraisalAuthority2],
    buyer: [buyer1],
    escrowAgent: escrowAgent,
    paymentAuthorities: [paymentAuthority1],
    schema: EscrowTermsSchema,
    seller: [seller1],
  }

  const moduleIdentifiersExample: ModuleIdentifier[] = [appraisalAuthority1, 'randomAddress', escrowAgent, paymentAuthority1]

  describe('moduleIdentifiersContainsOneOf', () => {
    // Positive test for scalar value
    test('returns true for a matching scalar value', () => {
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, (terms) => terms.escrowAgent, moduleIdentifiersExample)
      expect(result).toBeTruthy()
    })

    // Negative test for scalar value
    test('returns false for a non-matching scalar value', () => {
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, (terms) => terms.buyer, moduleIdentifiersExample)
      expect(result).toBeFalsy()
    })

    // Positive test for array values
    test('returns true when at least one array value matches', () => {
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, (terms) => terms.appraisalAuthorities, moduleIdentifiersExample)
      expect(result).toBeTruthy()
    })

    // Negative test for array values
    test('returns false when no array values match', () => {
      const nonMatchingModuleIdentifiers: ModuleIdentifier[] = ['nonMatching1', 'nonMatching2']
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, (terms) => terms.appraisalAuthorities, nonMatchingModuleIdentifiers)
      expect(result).toBeFalsy()
    })

    // Test for required parameter when termsValue is undefined
    test('returns false when termsValue is undefined and required is true', () => {
      const result = moduleIdentifiersContainsOneOf(
        { schema: EscrowTermsSchema }, // Empty object, no terms defined
        (terms) => terms.buyer, // This will be undefined
        moduleIdentifiersExample,
        true, // Explicitly stating required is true
      )
      expect(result).toBeFalsy()
    })

    // Test for not required parameter when termsValue is undefined
    test('returns true when termsValue is undefined and required is false', () => {
      const result = moduleIdentifiersContainsOneOf(
        { schema: EscrowTermsSchema }, // Empty object, no terms defined
        (terms) => terms.buyer, // This will be undefined
        moduleIdentifiersExample,
        false, // Required is false
      )
      expect(result).toBeTruthy()
    })
  })
})
