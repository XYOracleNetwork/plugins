import { AsObjectFactory } from '@xylabs/sdk-js'
import type { PayloadWithSources, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { SupportedCurrency } from '../Currency.ts'
import { ReceiptSchema } from './Schema.ts'

export interface ReceiptFields {
  /**
   * The amount paid
   */
  amount: number
  /**
   * The currency of the amount paid
   */
  currency: SupportedCurrency
}

/**
 * A receipt is a record of a payment made
 */
export type Receipt = PayloadWithSources<ReceiptFields, ReceiptSchema>

/**
 * Identity function for determine if an object is a Receipt
 */
export const isReceipt = isPayloadOfSchemaType<Receipt>(ReceiptSchema)
export const asReceipt = AsObjectFactory.create<Receipt>(isReceipt)
export const asOptionalReceipt = AsObjectFactory.createOptional<Receipt>(isReceipt)

/**
 * Identity function for determine if an object is a Receipt with sources
 */
export const isReceiptWithSources = isPayloadOfSchemaTypeWithSources<Receipt>(ReceiptSchema)
export const asReceiptWithSources = AsObjectFactory.create<WithSources<Receipt>>(isReceiptWithSources)
export const asOptionalReceiptWithSources = AsObjectFactory.createOptional<WithSources<Receipt>>(isReceiptWithSources)
