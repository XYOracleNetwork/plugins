import type { ModuleIdentifier } from '@xyo-network/module-model'
import type { PayloadValueExpression } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../../Terms.ts'

/**
 * Checks if property value of the escrow terms contains one of the valid moduleIdentifiers
 * @param escrowTerms The escrow terms to validate
 * @param propertyExpression The selector to get the property containing the moduleIdentifier(s) from the escrow terms
 * @param moduleIdentifiers The list of allowed moduleIdentifiers
 * @param required Is the property required to be present
 * @returns True if the property value contains one of the valid moduleIdentifiers
 */
export const moduleIdentifiersContainsOneOf = (
  escrowTerms: EscrowTerms,
  propertyExpression: PayloadValueExpression<EscrowTerms, 'appraisalAuthorities' | 'buyer' | 'escrowAgent' | 'paymentAuthorities' | 'seller'>,
  moduleIdentifiers: ModuleIdentifier[],
  required: boolean = true,
) => {
  const termsValue: string | string[] | undefined = propertyExpression(escrowTerms)
  if (termsValue === undefined) {
    return required ? false : true
  } else {
    return Array.isArray(termsValue) ? termsValue.some(address => moduleIdentifiers.includes(address)) : moduleIdentifiers.includes(termsValue)
  }
}

/**
 * Checks if property value of the escrow terms contains all of the valid moduleIdentifiers
 * @param escrowTerms The escrow terms to validate
 * @param selector The selector to get the property containing the moduleIdentifier(s) from the escrow terms
 * @param moduleIdentifiers The list of allowed moduleIdentifiers
 * @param required Is the property required to be present
 * @returns True if the property value contains all of the valid moduleIdentifiers
 */
export const moduleIdentifiersContainsAllOf = (
  escrowTerms: EscrowTerms,
  selector: PayloadValueExpression<EscrowTerms, 'appraisalAuthorities' | 'buyer' | 'escrowAgent' | 'paymentAuthorities' | 'seller'>,
  moduleIdentifiers: ModuleIdentifier[],
  required: boolean = true,
) => {
  const termsValue: string | string[] | undefined = selector(escrowTerms)
  if (termsValue === undefined) {
    return required ? false : true
  } else {
    return Array.isArray(termsValue) ? termsValue.every(address => moduleIdentifiers.includes(address)) : moduleIdentifiers.includes(termsValue)
  }
}
