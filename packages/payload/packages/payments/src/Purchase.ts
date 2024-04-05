import { Hash } from '@xylabs/hex'
import { PayloadWithSources } from '@xyo-network/payload-model'

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
