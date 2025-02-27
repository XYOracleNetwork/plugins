import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources, PayloadWithSources, WithSources,
} from '@xyo-network/payload-model'

import { PaymentStatusSchema } from './Schema.ts'

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
export const asPaymentStatus = AsObjectFactory.create<PaymentStatus>(isPaymentStatus)
export const asOptionalPaymentStatus = AsObjectFactory.createOptional<PaymentStatus>(isPaymentStatus)

/**
 * Identity function for determine if an object is a PaymentStatus with sources
 */
export const isPaymentStatusWithSources = isPayloadOfSchemaTypeWithSources<PaymentStatus>(PaymentStatusSchema)
export const asPaymentStatusWithSources = AsObjectFactory.create<WithSources<PaymentStatus>>(isPaymentStatusWithSources)
export const asOptionalPaymentStatusWithSources = AsObjectFactory.createOptional<WithSources<PaymentStatus>>(isPaymentStatusWithSources)
