import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

import { SupportedCurrency } from '../Currency.ts'
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

/**
 * Identity function for determine if an object is a Receipt with sources
 */
export const isReceiptWithSources = isPayloadOfSchemaTypeWithSources<Receipt>(ReceiptSchema)

/**
 * Identity function for determine if an object is a Receipt with meta
 */
export const isReceiptWithMeta = isPayloadOfSchemaTypeWithMeta<Receipt>(ReceiptSchema)
