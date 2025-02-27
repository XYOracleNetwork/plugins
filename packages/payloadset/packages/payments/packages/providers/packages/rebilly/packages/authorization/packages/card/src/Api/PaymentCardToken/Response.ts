import { PaymentMethod, RequestBillingAddress } from './Request.ts'

export interface ResponseBillingAddress extends RequestBillingAddress {
  hash?: string | null
}

/**
 * Main interface for API response encapsulating all relevant details.
 */
export interface CreateTokenResponse {
  /** Hyperlinks to related API resources. */
  _links: Link[]
  /** Billing address associated with the payment token. */
  billingAddress: ResponseBillingAddress
  /** Card brand such as Visa or Mastercard. */
  brand: string
  /** An identifier for the browser data. */
  browserData: unknown | null
  /** Date and time when the token was created. */
  createdTime: string
  /** Expiration time of the token. */
  expirationTime: string | null
  /** Date and time when the token expired. */
  expiredTime: string | null
  /** An identifier for the fingerprint of the device used. */
  fingerprint: string | null
  /** An identifier of the token. */
  id: string
  /** Indicates if the token has been used. */
  isUsed: boolean
  /** The last four digits of the payment instrument. */
  last4: string
  /** Payment method such as 'payment-card'. */
  method: PaymentMethod
  /** Payment instrument details. */
  paymentInstrument: ResponsePaymentCardInstrument
  /** Metadata related to risk evaluation. */
  riskMetadata: unknown | null
  /** Date and time when the token was last updated. */
  updatedTime: string
  /** Usage time of the token. */
  usageTime: string | null
  /** Indicates if the token has already been used. */
  used: boolean
  /** Date and time when the token was first used. */
  usedTime: string | null
}

/**
 * Payment instrument details such as credit card information.
 */
export interface ResponsePaymentCardInstrument {
  /** Bank identification number or issuer identification number of the card. */
  bin: string
  /** Card brand such as Visa or Mastercard. */
  brand: string
  /** Expiration month of the card. */
  expMonth: number
  /** Expiration year of the card. */
  expYear: number
  /** Last four digits of the card number. */
  last4: string
}

/**
 * Links structure for API navigation.
 */
export interface Link {
  /** URL of the related resource. */
  href: string
  /** Relation type of the link. */
  rel: string
}
