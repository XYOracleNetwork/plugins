import { Hash } from '@xylabs/hex'
import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources, PayloadWithSources, WithSources,
} from '@xyo-network/payload-model'

import { PurchaseSchema } from './Schema.ts'

export interface PurchaseFields {
  /**
   * The things that were purchased
   */
  assets: Hash[]
  /**
   * The receipts for payments for this purchase.  Array to allow for multiple payments
   * for a single quote.
   */
  receipts: Hash[]
}

/**
 * A purchase ties a payment made to a quote
 */
export type Purchase = PayloadWithSources<PurchaseFields, PurchaseSchema>

/**
 * Identity function for determine if an object is a Purchase
 */
export const isPurchase = isPayloadOfSchemaType<Purchase>(PurchaseSchema)
export const asPurchase = AsObjectFactory.create<Purchase>(isPurchase)
export const asOptionalPurchase = AsObjectFactory.createOptional<Purchase>(isPurchase)

/**
 * Identity function for determine if an object is a Purchase with sources
 */
export const isPurchaseWithSources = isPayloadOfSchemaTypeWithSources<Purchase>(PurchaseSchema)
export const asPurchaseWithSources = AsObjectFactory.create<WithSources<Purchase>>(isPurchaseWithSources)
export const asOptionalPurchaseWithSources = AsObjectFactory.createOptional<WithSources<Purchase>>(isPurchaseWithSources)
