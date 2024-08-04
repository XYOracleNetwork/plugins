import { PaymentsSchema } from '../Schema.ts'

export const ReceiptSchema = `${PaymentsSchema}.receipt`
export type ReceiptSchema = typeof ReceiptSchema
