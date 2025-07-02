export interface ContactPhoneNumber {
  /**
   * Phone number label or name.
   * <= 45 characters
   */
  label: string
  /**
   * Specifies if the phone number is the contact's primary phone number.
   */
  primary?: boolean
  /**
   * Phone number value.
   * <= 50 characters
   */
  value: string
}

export interface ContactEmail {
  /**
   * Email label or name.
   * <= 45 characters
   */
  label: string
  /**
   * Specifies if the email address is the contact's primary email address.
   */
  primary?: boolean
  /**
   * Email address value.
   * <= 255 characters
   */
  value: string
}

/**
 * Billing address details associated with the payment token.
 */
export interface RequestBillingAddress {
  /** Street address line 1. */
  address?: string
  /** Street address line 2. */
  address2?: string | null
  /** City of the billing address. */
  city?: string
  /** Country code of the billing address, ISO 3166-1 alpha-2 code. */
  country?: string
  /** Date of birth of the cardholder. */
  dob?: string
  /** Email addresses associated with the billing address. */
  emails?: ContactEmail[]
  /** First name of the cardholder. */
  firstName: string
  /** Job title of the cardholder. */
  jobTitle?: string | null
  /** Last name of the cardholder. */
  lastName: string
  /** Organization or company name associated with the billing address. */
  organization?: string | null
  /** Phone numbers associated with the billing address. */
  phoneNumbers?: ContactPhoneNumber[]
  /** Postal or ZIP code of the billing address. */
  postalCode?: string
  /** State or region of the billing address. */
  region?: string
}

export interface RequestPaymentCardInstrument {
  /**
   * Card Verification Value (CVV/CVC) of the payment card.
   */
  cvv: string
  /**
   * Expiration month of the payment card.
   */
  expMonth: number
  /**
   * Expiration year of the payment card.
   */
  expYear: number
  /**
   * Primary Account Number (PAN) of the payment card. This value is required to perform a payment.
   */
  pan: string
}

export type PaymentMethod
  // | 'ach'
  // | 'AdvCash'
  // | 'Alfa-click'
  // | 'Alipay'
  // | 'AstroPay Card'
  // | 'AstroPay-GO'
  // | 'Baloto'
  // | 'Bancontact-mobile'
  // | 'Bancontact'
  // | 'bank-transfer-2'
  // | 'bank-transfer-3'
  // | 'bank-transfer-4'
  // | 'bank-transfer-5'
  // | 'bank-transfer-6'
  // | 'bank-transfer-7'
  // | 'bank-transfer-8'
  // | 'bank-transfer-9'
  // | 'bank-transfer'
  // | 'BankReferenced'
  // | 'Beeline'
  // | 'Belfius-direct-net'
  // | 'bitcoin'
  // | 'Bizum'
  // | 'Boleto'
  // | 'cash-deposit'
  // | 'cash'
  // | 'CASHlib'
  // | 'CashToCode'
  // | 'check'
  // | 'China UnionPay'
  // | 'Cleo'
  // | 'CODVoucher'
  // | 'Conekta-oxxo'
  // | 'cryptocurrency'
  // | 'Cupon-de-pagos'
  // | 'digital-wallet'
  // | 'domestic-cards'
  // | 'echeck'
  // | 'ecoPayz'
  // | 'ecoVoucher'
  // | 'Efecty'
  // | 'ePay.bg'
  // | 'EPS'
  // | 'eZeeWallet'
  // | 'FasterPay'
  // | 'Flexepin'
  // | 'Giropay'
  // | 'Google Pay'
  // | 'Gpaysafe'
  // | 'iDEAL'
  // | 'iDebit'
  // | 'ING-homepay'
  // | 'INOVAPAY-pin'
  // | 'INOVAPAY-wallet'
  // | 'InstaDebit'
  // | 'instant-bank-transfer'
  // | 'InstantPayments'
  // | 'Interac-eTransfer'
  // | 'Interac-online'
  // | 'Interac'
  // | 'invoice'
  // | 'iWallet'
  // | 'Jeton'
  // | 'jpay'
  // | 'Khelocard'
  // | 'Klarna'
  // | 'KNOT'
  // | 'loonie'
  // | 'Matrix'
  // | 'MaxiCash'
  // | 'Megafon'
  // | 'MiFinity-eWallet'
  // | 'miscellaneous'
  // | 'MTS'
  // | 'MuchBetter'
  // | 'Multibanco'
  // | 'Neosurf'
  // | 'Netbanking'
  // | 'Neteller'
  // | 'Nordea-Solo'
  // | 'OchaPay'
  // | 'online-bank-transfer'
  // | 'Onlineueberweisen'
  // | 'oriental-wallet'
  // | 'OXXO'
  // | 'P24'
  // | 'Pagadito'
  // | 'PagoEffectivo'
  // | 'Pagsmile-deposit-express'
  // | 'Pagsmile-lottery'
  // | 'Pay4Fun'
  // | 'PayCash'
  // | 'Payeer'
  = 'payment-card'
// | 'PaymentAsia-crypto'
// | 'Paymero'
// | 'Paynote'
// | 'paypal'
// | 'Paysafecard'
// | 'Paysafecash'
// | 'PayTabs'
// | 'Perfect-money'
// | 'phone'
// | 'PhonePe'
// | 'Piastrix'
// | 'PinPay'
// | 'plaid-account'
// | 'POLi'
// | 'PostFinance-card'
// | 'PostFinance-e-finance'
// | 'QIWI'
// | 'QPay'
// | 'QQPay'
// | 'rapyd-checkout'
// | 'Resurs'
// | 'SafetyPay'
// | 'SEPA'
// | 'Skrill Rapid Transfer'
// | 'Skrill'
// | 'SMSVoucher'
// | 'Sofort'
// | 'SparkPay'
// | 'swift-dbt'
// | 'Tele2'
// | 'Terminaly-RF'
// | 'ToditoCash-card'
// | 'Trustly'
// | 'UPayCard'
// | 'UPI'
// | 'USD-coin'
// | 'VCreditos'
// | 'VenusPoint'
// | 'voucher-2'
// | 'voucher-3'
// | 'voucher-4'
// | 'voucher'
// | 'Webmoney'
// | 'Webpay Card'
// | 'Webpay-2'
// | 'Webpay'
// | 'WeChat Pay'
// | 'XPay-P2P'
// | 'XPay-QR'
// | 'Yandex-money'
// | 'Zimpler'
// | 'Zotapay'

export interface CreatePaymentTokenRequest {
  billingAddress: RequestBillingAddress
  method: PaymentMethod
  paymentInstrument: RequestPaymentCardInstrument
}
