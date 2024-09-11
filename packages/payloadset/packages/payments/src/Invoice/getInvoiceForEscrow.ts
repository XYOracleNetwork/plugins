import type { Hash } from '@xylabs/hex'
import type { DivinerInstance } from '@xyo-network/diviner-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { EscrowTerms, Payment } from '@xyo-network/payment-payload-plugins'
import { PaymentSchema } from '@xyo-network/payment-payload-plugins'

import type { Discount } from '../Discount/index.ts'
import { isDiscount } from '../Discount/index.ts'
import type { Subtotal } from '../Subtotal/index.ts'
import { isSubtotal } from '../Subtotal/index.ts'
import type { Total } from '../Total/index.ts'
import { isTotal } from '../Total/index.ts'
import type { Invoice } from './Invoice.ts'

/**
 * Validates the escrow terms to ensure they are valid for a purchase
 * @returns A payment if the terms are valid for a purchase, undefined otherwise
 */
export const getInvoiceForEscrow = async (
  terms: EscrowTerms,
  dataHashMap: Record<Hash, Payload>,
  paymentTotalDiviner: DivinerInstance,
): Promise<Invoice | undefined> => {
  const payloads = Object.values(dataHashMap)
  const results = await paymentTotalDiviner.divine([terms, ...payloads])
  const subtotal = results.find(isSubtotal) as Subtotal | undefined
  const discount = results.find(isDiscount) as Discount | undefined
  const total = results.find(isTotal) as Total | undefined
  if (!subtotal || !total) return undefined
  const { amount, currency } = total
  if (currency !== 'USD') return undefined
  const sources = await getSources(terms, subtotal, total, discount)
  const payment: Payment = {
    amount, currency, schema: PaymentSchema, sources,
  }
  return discount ? [subtotal, total, payment, discount] : [subtotal, total, payment]
}

const getSources = async (terms: EscrowTerms, subtotal: Subtotal, total: Total, discount?: Discount): Promise<Hash[]> => {
  const sources = discount ? [terms, subtotal, total, discount] : [terms, subtotal, total]
  return await Promise.all(sources.map(p => PayloadBuilder.dataHash(p)))
}
