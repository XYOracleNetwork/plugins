import '@xylabs/vitest-extended'

import type { Address } from '@xylabs/sdk-js'
import type { ModuleIdentifier } from '@xyo-network/module-model'
import {
  describe, expect, test,
} from 'vitest'

import type { EscrowTerms } from '../../../../Terms/index.ts'
import { EscrowTermsSchema } from '../../../../Terms/index.ts'
import { moduleIdentifiersContainsOneOf } from '../moduleInstanceValidators.ts'

describe('RegistrarSentinel', () => {
  const appraisalAuthority1 = 'address1' as Address
  const appraisalAuthority2 = 'address2' as Address
  const buyer1 = 'address3' as Address
  const escrowAgent = 'address4' as Address
  const paymentAuthority1 = 'address5' as Address
  const seller1 = 'address6' as Address
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
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, terms => terms.escrowAgent, moduleIdentifiersExample)
      expect(result).toBeTruthy()
    })

    // Negative test for scalar value
    test('returns false for a non-matching scalar value', () => {
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, terms => terms.buyer, moduleIdentifiersExample)
      expect(result).toBeFalsy()
    })

    // Positive test for array values
    test('returns true when at least one array value matches', () => {
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, terms => terms.appraisalAuthorities, moduleIdentifiersExample)
      expect(result).toBeTruthy()
    })

    // Negative test for array values
    test('returns false when no array values match', () => {
      const nonMatchingModuleIdentifiers: ModuleIdentifier[] = ['nonMatching1', 'nonMatching2']
      const result = moduleIdentifiersContainsOneOf(escrowTermsExample, terms => terms.appraisalAuthorities, nonMatchingModuleIdentifiers)
      expect(result).toBeFalsy()
    })

    // Test for required parameter when termsValue is undefined
    test('returns false when termsValue is undefined and required is true', () => {
      const result = moduleIdentifiersContainsOneOf(
        { schema: EscrowTermsSchema }, // Empty object, no terms defined
        terms => terms.buyer, // This will be undefined
        moduleIdentifiersExample,
        true, // Explicitly stating required is true
      )
      expect(result).toBeFalsy()
    })

    // Test for not required parameter when termsValue is undefined
    test('returns true when termsValue is undefined and required is false', () => {
      const result = moduleIdentifiersContainsOneOf(
        { schema: EscrowTermsSchema }, // Empty object, no terms defined
        terms => terms.buyer, // This will be undefined
        moduleIdentifiersExample,
        false, // Required is false
      )
      expect(result).toBeTruthy()
    })
  })
})
