import { EscrowTerms } from '@xyo-network/payment-payload-plugins'

/**
 * Type corresponding to the escrow terms properties
 */
export type EscrowTermsProperty = keyof EscrowTerms

/**
 * Type corresponding to the escrow terms property value
 */
export type EscrowTermsValue<K extends EscrowTermsProperty> = EscrowTerms[K]

/**
 * An expressions that selects a property value from the escrow terms
 */
export type EscrowTermsValueExpression<
  /**
   * The property of the escrow terms to select
   */
  K extends EscrowTermsProperty,
  /**
   * The type of the selected property's value
   */
  V = EscrowTermsValue<K>,
> = (escrowTerms: EscrowTerms) => V

/**
 * A function that validates the supplied escrow terms
 */
export type EscrowTermsValidationFunction = (escrowTerms: EscrowTerms) => boolean | Promise<boolean>
