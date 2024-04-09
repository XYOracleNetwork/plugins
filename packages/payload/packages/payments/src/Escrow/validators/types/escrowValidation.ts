import { PayloadProperty, PayloadValidationFunction, PayloadValue, PayloadValueExpression } from '@xyo-network/payload-model'
import { EscrowTerms } from '../../Terms'

/**
 * Type corresponding to the escrow terms properties
 */
export type EscrowTermsProperty = PayloadProperty<EscrowTerms>

/**
 * Type corresponding to the escrow terms property value
 */
export type EscrowTermsValue = PayloadValue<EscrowTerms>

/**
 * An expressions that selects a property value from the escrow terms
 */
export type EscrowTermsValueExpression<
  /**
   * The property of the payload to select
   */
  Key extends EscrowTermsProperty = EscrowTermsProperty,
  /**
   * The type of the selected property's value
   */
  TValue = PayloadValue<EscrowTerms, Key>,
> = PayloadValueExpression<EscrowTerms, Key, TValue>

/**
 * A function that validates the supplied escrow terms
 */
export type EscrowTermsValidationFunction = PayloadValidationFunction<EscrowTerms>
