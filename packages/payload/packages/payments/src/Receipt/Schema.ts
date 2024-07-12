import { PaymentsSchema } from '../Schema.js'

export const ReceiptSchema = `${PaymentsSchema}.receipt`
export type ReceiptSchema = typeof ReceiptSchema
