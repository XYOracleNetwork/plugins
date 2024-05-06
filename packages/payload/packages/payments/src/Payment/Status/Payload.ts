import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
  PayloadWithSources,
} from '@xyo-network/payload-model'

import { PaymentStatusSchema } from './Schema'

export interface PaymentStatusFields {
  /**
   * The result of the payment (i.e. declined)
   */
  result?: string

  /**
   * The status of the payment (i.e. completed)
   */
  status: string
}

/**
 * A payment status is the outcome of a payment attempt
 */
export type PaymentStatus = PayloadWithSources<PaymentStatusFields, PaymentStatusSchema>

/**
 * Identity function for determine if an object is a PaymentStatus
 */
export const isPaymentStatus = isPayloadOfSchemaType<PaymentStatus>(PaymentStatusSchema)

/**
 * Identity function for determine if an object is a PaymentStatus with sources
 */
export const isPaymentStatusWithSources = isPayloadOfSchemaTypeWithSources<PaymentStatus>(PaymentStatusSchema)

/**
 * Identity function for determine if an object is a PaymentStatus with meta
 */
export const isPaymentStatusWithMeta = isPayloadOfSchemaTypeWithMeta<PaymentStatus>(PaymentStatusSchema)
