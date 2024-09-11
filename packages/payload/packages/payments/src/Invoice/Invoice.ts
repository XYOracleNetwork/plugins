import type { Payment } from '@xyo-network/payment-payload-plugins'

import type { Discount } from '../Discount/index.ts'
import type { Subtotal } from '../Subtotal/index.ts'
import type { Total } from '../Total/index.ts'

/**
 * A tuple containing the subtotal, total, and payment for an invoice.
 */
export type StandardInvoice = [Subtotal, Total, Payment]

/**
 * A tuple containing the subtotal, total, payment, and discount for an invoice.
 */
export type DiscountedInvoice = [...StandardInvoice, Discount]

/**
 * An invoice.
 */
export type Invoice = StandardInvoice | DiscountedInvoice
