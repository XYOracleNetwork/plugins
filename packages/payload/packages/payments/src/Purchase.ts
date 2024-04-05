import { Hash } from '@xylabs/hex'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

export type PurchaseSchema = 'network.xyo.payments.purchase'
export const PurchaseSchema: PurchaseSchema = 'network.xyo.payments.purchase'

export interface PurchaseFields {
  /**
   * The things that were purchased
   */
  assets: Hash[]
  /**
   * The payments for this purchase.  Array to allow for multiple payments
   * for a single quote.
   */
  payments: Hash[]
}

/**
 * A purchase ties a payment made to a quote
 */
export type Purchase = PayloadWithSources<PurchaseFields, PurchaseSchema>

/**
 * Identity function for determine if an object is a Payment
 */
export const isPayment = isPayloadOfSchemaType<Purchase>(PurchaseSchema)

/**
 * Identity function for determine if an object is a Payment with sources
 */
export const isPaymentWithSources = isPayloadOfSchemaTypeWithSources<Purchase>(PurchaseSchema)

/**
 * Identity function for determine if an object is a Payment with meta
 */
export const isPaymentWithMeta = isPayloadOfSchemaTypeWithMeta<Purchase>(PurchaseSchema)
