import { PaymentsSchema } from '../Schema'

export const ReceiptSchema = `${PaymentsSchema}.receipt`
export type ReceiptSchema = typeof ReceiptSchema
